"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Filter, Loader2, CheckCircle2, Clock, MailOpen, Phone, MapPin, Mail, FileText, ChevronDown, Save, FileEdit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MobileCard, MobileCardList } from "@/components/ui/mobile-card";
import { updateInquiryStatus, deleteAllInquiries } from "./actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function InquiriesClient({ initialInquiries, services, userRole }: { initialInquiries: any[], services: any[], userRole: string }) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Note dialog states
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [activeNoteInquiry, setActiveNoteInquiry] = useState<any>(null);
  const [currentNote, setCurrentNote] = useState("");
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = inq.nama.toLowerCase().includes(search.toLowerCase()) || 
                          inq.pesan.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || inq.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteAllConfirm = () => {
    if (userRole !== "superadmin") {
      toast.error("Hanya superadmin yang dapat menghapus semua pesan.");
      return;
    }
    setIsDeleteAllDialogOpen(true);
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      const res = await deleteAllInquiries();
      if (res.error) throw new Error(res.error);
      
      toast.success(res.dummyMode ? "Dummy: Semua pesan dihapus" : "Semua pesan berhasil dihapus");
      setInquiries([]);
      setIsDeleteAllDialogOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error, dummyMode } = await updateInquiryStatus(id, newStatus, null); // Don't update note here
    
    if (error) {
      toast.error(error);
    } else {
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      toast.success(dummyMode ? "Status diperbarui (Dummy)" : "Status berhasil diperbarui");
      router.refresh();
    }
    setUpdatingId(null);
  };

  const saveNote = async () => {
    if (!activeNoteInquiry) return;
    setIsLoading(true);
    const { error, dummyMode } = await updateInquiryStatus(activeNoteInquiry.id, activeNoteInquiry.status, currentNote);
    
    if (error) {
      toast.error(error);
    } else {
      setInquiries(inquiries.map(inq => inq.id === activeNoteInquiry.id ? { ...inq, catatan_internal: currentNote } : inq));
      toast.success(dummyMode ? "Catatan diperbarui (Dummy)" : "Catatan internal berhasil disimpan");
      setIsNoteDialogOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  };
  const [isLoading, setIsLoading] = useState(false);

  const openNoteDialog = (inq: any) => {
    setActiveNoteInquiry(inq);
    setCurrentNote(inq.catatan_internal || "");
    setIsNoteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "baru":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-1"><MailOpen className="w-3 h-3 mr-1"/> Baru</Badge>;
      case "diproses":
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-1"><Clock className="w-3 h-3 mr-1"/> Diproses</Badge>;
      case "selesai":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-1"><CheckCircle2 className="w-3 h-3 mr-1"/> Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceName = (id: string) => {
    if (!id) return "Lainnya";
    return services.find(s => s.id === id)?.nama || "Lainnya";
  };

  // View only content (no actions inside)
  const renderViewContent = (inq: any) => (
    <div className="space-y-4 pt-2 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Informasi Klien</h4>
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Nama Pengirim</span>
                <span className="text-foreground font-medium flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {inq.nama.charAt(0)}
                  </div>
                  {inq.nama}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">No. WhatsApp</span>
                  <a href={`https://wa.me/${inq.no_hp.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium flex items-center gap-1.5 text-sm">
                    <Phone className="w-3.5 h-3.5" /> {inq.no_hp}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Email</span>
                  <span className="text-foreground font-medium flex items-center gap-1.5 text-sm break-all">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {inq.email || "-"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Kota / Tempat Tinggal</span>
                <span className="text-foreground font-medium flex items-center gap-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {inq.tempat_tinggal || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Detail Permintaan</h4>
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Waktu Masuk</span>
                <span className="text-foreground font-medium text-sm">
                  {format(new Date(inq.created_at), "dd MMM yyyy, HH:mm")} WIB
                </span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Kategori Layanan</span>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{getServiceName(inq.layanan_id)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Status</span>
                {getStatusBadge(inq.status)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Pesan / Kronologi
        </h4>
        <div className="text-foreground text-sm whitespace-pre-wrap break-all leading-relaxed bg-background p-4 rounded-lg border border-border max-h-[300px] overflow-y-auto overflow-x-hidden">
          {inq.pesan}
        </div>
      </div>

      {/* Internal Notes Read-only */}
      {inq.catatan_internal && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Catatan Internal Admin
          </h4>
          <div className="text-muted-foreground text-sm whitespace-pre-wrap break-all italic bg-muted/50 p-4 rounded-lg border border-border">
            {inq.catatan_internal}
          </div>
        </div>
      )}
    </div>
  );

  return (
      <div className="space-y-8">
        <AdminPageHeader title="Pesan Konsultasi">
          <Button onClick={handleDeleteAllConfirm} variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Hapus Semua Pesan
          </Button>
        </AdminPageHeader>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau isi pesan..."
              className="pl-9 bg-background border-border text-foreground focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["all", "baru", "diproses", "selesai"].map((f) => (
              <Button
                key={f}
                variant="outline"
                size="sm"
                onClick={() => setFilter(f)}
                className={`border-border ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-background">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium w-[20%]">Pengirim</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[30%]">Pesan Masuk</TableHead>
                <TableHead className="text-muted-foreground font-medium w-[15%]">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right w-[35%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow className="hover:bg-transparent border-border">
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Tidak ada pesan konsultasi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inq) => (
                  <TableRow key={inq.id} className="border-border hover:bg-muted transition-colors">
                    <TableCell>
                      <div className="font-bold text-foreground mb-1">{inq.nama}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Phone className="w-3 h-3" /> {inq.no_hp}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {getServiceName(inq.layanan_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-foreground text-sm whitespace-pre-wrap break-all line-clamp-3 leading-relaxed">
                        {inq.pesan}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inq.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-muted-foreground hover:text-primary border-border bg-background h-8"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border text-foreground sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-serif text-2xl text-primary">
                                Konsultasi: {inq.nama}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-2">
                              {renderViewContent(inq)}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {/* Status Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground border-border bg-background h-8">
                              {updatingId === inq.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                              Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border text-foreground z-50">
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "baru")}>
                              <MailOpen className="w-4 h-4 mr-2" /> Tandai Baru
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "diproses")}>
                              <Clock className="w-4 h-4 mr-2" /> Tandai Diproses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "selesai")}>
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Catatan Button */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-muted-foreground hover:text-primary border-border bg-background h-8"
                          onClick={() => openNoteDialog(inq)}
                        >
                          <FileEdit className="w-4 h-4 mr-1" />
                          Catatan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <MobileCardList>
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border border-border rounded-xl bg-card">
              Tidak ada pesan konsultasi ditemukan
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <MobileCard
                key={inq.id}
                avatar={
                  <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-primary font-bold font-serif shadow-sm">
                    {inq.nama.charAt(0).toUpperCase()}
                  </div>
                }
                title={<span className="font-serif tracking-wide">{inq.nama}</span>}
                subtitle={<span className="line-clamp-1">{getServiceName(inq.layanan_id)}</span>}
                badges={getStatusBadge(inq.status)}
                viewTitle={`Konsultasi: ${inq.nama}`}
                viewContent={renderViewContent(inq)}
                actions={
                  <div className="flex gap-2 flex-wrap justify-end">
                    {/* Mobile Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground border-border bg-background h-8">
                          {updatingId === inq.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                          Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border text-foreground z-50">
                        <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "baru")}>
                          <MailOpen className="w-4 h-4 mr-2" /> Tandai Baru
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "diproses")}>
                          <Clock className="w-4 h-4 mr-2" /> Tandai Diproses
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary cursor-pointer" onClick={() => updateStatus(inq.id, "selesai")}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Catatan Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-muted-foreground hover:text-primary border-border bg-background h-8"
                      onClick={() => openNoteDialog(inq)}
                    >
                      <FileEdit className="w-4 h-4 mr-1" />
                      Catatan
                    </Button>
                  </div>
                }
              />
            ))
          )}
        </MobileCardList>
      </div>

      {/* Internal Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary flex items-center gap-2">
              <FileEdit className="w-5 h-5" /> Catatan Internal
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Tambahkan catatan pribadi terkait progres penanganan kasus klien <strong className="text-foreground">{activeNoteInquiry?.nama}</strong>. Catatan ini hanya bisa dibaca oleh admin.
            </p>
            <Textarea 
              placeholder="Ketik catatan di sini..."
              className="bg-background border-border text-foreground resize-y focus-visible:ring-primary min-h-[150px] leading-relaxed break-all"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Batal</Button>
            </DialogClose>
            <Button onClick={saveNote} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} 
              Simpan Catatan
            </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>

        <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Semua Pesan?</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-muted-foreground">
              Apakah Anda yakin ingin menghapus <b>semua</b> pesan konsultasi? Tindakan ini tidak dapat dibatalkan.
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeletingAll}>Batal</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteAll} disabled={isDeletingAll}>
                {isDeletingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Hapus Semua
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
}




