import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { getTeamMembers } from "@/lib/api/team";
import { Award, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { generateMetadata as memberMetadata } from "./metadata";

export const generateMetadata = memberMetadata;

export default async function TimDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const team = await getTeamMembers();
  const member = team.find((item) => item.slug === slug);

  if (!member) {
    return <NotFound />;
  }

  const relatedTeam = team.filter((item) => item.id !== member.id).slice(0, 3);
  const specializationItems = member.spesialisasi
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const biographyParagraphs = (member.bio || "")
    .split(/\n{2,}|\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-background">
      <section className="border-b border-border pb-12 pt-28 md:pb-16 md:pt-36">
        <div className="container mx-auto px-4 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground md:mb-8"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Beranda
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link href="/tim" className="transition-colors hover:text-primary">
              Tim
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="line-clamp-1 text-foreground">{member.nama}</span>
          </nav>

          <h1 className="max-w-5xl font-serif text-4xl font-bold leading-[1.04] text-foreground md:text-5xl lg:text-[3.4rem]">
            {member.nama}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-primary md:text-lg">{member.jabatan}</p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[3/4]">
                <SafeImage src={member.foto_url} alt={member.nama} className="h-full w-full object-cover" />
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-center gap-3 text-foreground">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-2xl font-semibold">Profil Singkat</h2>
                </div>

                {biographyParagraphs.length > 0 ? (
                  <div className="mt-5 space-y-4 text-muted-foreground">
                    {biographyParagraphs.map((paragraph, index) => (
                      <p key={`${member.id}-bio-${index}`} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 leading-relaxed text-muted-foreground">
                    Profil anggota tim ini akan segera diperbarui.
                  </p>
                )}

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                    Spesialisasi
                  </h3>
                  {specializationItems.length > 0 ? (
                    <ul className="mt-4 grid gap-2 text-muted-foreground md:grid-cols-2">
                      {specializationItems.map((item, index) => (
                        <li key={`${member.id}-specialization-${index}`} className="flex gap-2 leading-relaxed">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-muted-foreground">
                      Spesialisasi belum ditambahkan.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/konsultasi">Isi Form Konsultasi</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/tim">Kembali ke Halaman Tim</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedTeam.length > 0 ? (
        <section className="border-t border-border bg-secondary py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-8 md:mb-10">
              <div className="flex items-center gap-3 text-foreground">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-3xl font-semibold md:text-4xl">Anggota Tim Lainnya</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedTeam.map((item) => (
                <Link
                  key={item.id}
                  href={`/tim/${item.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={item.foto_url}
                      alt={item.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-primary">{item.jabatan}</p>
                    <h3 className="font-serif text-xl font-semibold text-foreground">{item.nama}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.spesialisasi}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
