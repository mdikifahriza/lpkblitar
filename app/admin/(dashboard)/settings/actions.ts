"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getStorageBucketName, getStoragePathFromUrl } from "@/lib/storage";

type SiteSettingsPayload = Record<string, string>;

export async function updateSiteSettings(formData: SiteSettingsPayload) {
  try {
    const supabase = await createClient();
    const previousAssetEntries = Object.entries(formData).filter(([key]) => key.startsWith("previous_"));
    const settingsData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => !key.startsWith("previous_"))
    );

    const { error: checkError } = await supabase.from("site_settings").select("id").limit(1);

    if (checkError) {
      console.warn("⚠️ Supabase site_settings table missing or errored:", checkError.message);
      return { error: "Tabel pengaturan tidak ditemukan di database." };
    }

    const promises = Object.entries(settingsData).map(async ([key, value]) => {
      const payload = {
        key,
        value,
        updated_at: new Date().toISOString(),
      };

      const { error: err1 } = await supabase.from("site_settings").upsert(payload, {
        onConflict: "key",
      });

      if (err1 && err1.code === "42703") {
        const { error: err2 } = await supabase.from("site_settings").upsert(
          {
            setting_key: key,
            setting_value: value,
          },
          {
            onConflict: "setting_key",
          }
        );

        if (err2) {
          throw err2;
        }
      } else if (err1) {
        throw err1;
      }
    });

    await Promise.all(promises);

    const obsoletePaths = previousAssetEntries.reduce<string[]>((accumulator, [previousKey, previousUrl]) => {
      const currentKey = previousKey.replace(/^previous_/, "");
      const currentValue = settingsData[currentKey];

      if (
        typeof previousUrl === "string" &&
        typeof currentValue === "string" &&
        previousUrl &&
        previousUrl !== currentValue
      ) {
        const previousPath = getStoragePathFromUrl(previousUrl);

        if (previousPath) {
          accumulator.push(previousPath);
        }
      }

      return accumulator;
    }, []);

    if (obsoletePaths.length > 0) {
      const adminClient = createAdminClient();
      await adminClient.storage.from(getStorageBucketName()).remove([...new Set(obsoletePaths)]);
    }

    return { success: true };
  } catch (error) {
    console.error("Settings update error:", error);
    return { error: "Terjadi kesalahan server saat menyimpan pengaturan." };
  }
}
