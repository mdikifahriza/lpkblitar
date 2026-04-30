"use server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClientSupabase } from "@/lib/supabase/server";
import { getStorageBucketName, getStoragePathFromUrl } from "@/lib/storage";

// Helper to get admin client
const getAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function getUsers() {
  try {
    const supabase = await createServerClientSupabase();
    
    // Check if the user requesting this is a superadmin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized", data: [] };

    const adminClient = getAdminClient();
    
    const { data: profile, error: errProfile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (errProfile || !profile || profile.role !== 'superadmin') {
      return { error: "Unauthorized", data: [] };
    }
    
    // Get profiles
    const { data: profiles, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) throw profileError;

    // Get emails from auth.users
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
    
    if (authError) throw authError;

    // Merge data
    const users = profiles.map(p => {
      const authUser = authUsers.users.find(u => u.id === p.id);
      return {
        ...p,
        email: authUser?.email || ''
      };
    });

    return { data: users };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { error: "Gagal memuat pengguna.", data: [] };
  }
}

export async function upsertUser(formData: any) {
  try {
    const supabase = await createServerClientSupabase();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) return { error: "Unauthorized" };

    const adminClient = getAdminClient();

    let userId = formData.id;

    // Validate Superadmin Access First
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return { error: "Anda bukan superadmin." };
    }

    // If new user, create in auth.users first
    if (!userId) {
      if (!formData.email || !formData.password) {
        return { error: "Email dan kata sandi wajib diisi untuk user baru." };
      }

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: { full_name: formData.nama_lengkap, avatar_url: formData.foto_url || "" }
      });

      if (authError) throw authError;
      userId = authData.user.id;
    } else {
      // If existing user and password provided, update password
      const updates: any = {
        user_metadata: { full_name: formData.nama_lengkap, avatar_url: formData.foto_url || "" }
      };
      
      if (formData.password) {
        updates.password = formData.password;
      }
      
      if (formData.email) {
         updates.email = formData.email;
         updates.email_confirm = true;
      }

      const { error: updateAuthError } = await adminClient.auth.admin.updateUserById(userId, updates);
      if (updateAuthError) throw updateAuthError;
    }

    // Upsert to profiles table
    const profileData = {
      id: userId,
      nama_lengkap: formData.nama_lengkap,
      username: formData.username,
      role: formData.role,
      no_hp: formData.no_hp || null,
      foto_url: formData.foto_url || null,
    };

    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      // If profile insert fails for a NEW user, we should probably delete the auth user to keep state clean
      if (!formData.id && userId) {
        await adminClient.auth.admin.deleteUser(userId);
      }
      throw profileError;
    }

    if (
      typeof formData.previous_foto_url === "string" &&
      typeof formData.foto_url === "string" &&
      formData.previous_foto_url &&
      formData.previous_foto_url !== formData.foto_url
    ) {
      const previousPath = getStoragePathFromUrl(formData.previous_foto_url);

      if (previousPath) {
        await adminClient.storage.from(getStorageBucketName()).remove([previousPath]);
      }
    }

    return { success: true, userId };
  } catch (error: any) {
    console.error("Error upserting user:", error);
    return { error: error.message || "Gagal menyimpan pengguna." };
  }
}

export async function deleteUser(id: string) {
  try {
    const supabase = await createServerClientSupabase();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser) return { error: "Unauthorized" };
    if (currentUser.id === id) return { error: "Anda tidak dapat menghapus akun Anda sendiri." };

    const adminClient = getAdminClient();

    // Verify requesting user is superadmin
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role, foto_url')
      .eq('id', currentUser.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return { error: "Anda bukan superadmin." };
    }

    // Get user to be deleted to delete their photo if exists
    const { data: userToDelete } = await adminClient
      .from('profiles')
      .select('foto_url')
      .eq('id', id)
      .single();

    // Delete from auth.users (this will cascade delete the profile if DB is set up correctly)
    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) throw error;

    // Delete old photo from storage
    if (userToDelete?.foto_url) {
      const filePath = getStoragePathFromUrl(userToDelete.foto_url);

      if (filePath) {
        await adminClient.storage.from(getStorageBucketName()).remove([filePath]);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { error: error.message || "Gagal menghapus pengguna." };
  }
}
