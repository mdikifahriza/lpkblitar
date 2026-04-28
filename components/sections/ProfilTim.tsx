"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { motion } from "framer-motion";
import Image from "next/image";

interface TeamMember {
  id: string;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  foto_url: string;
  bio?: string;
  is_pimpinan?: boolean;
}

interface ProfilTimProps {
  team: TeamMember[];
}

export function ProfilTim({ team }: ProfilTimProps) {
  // Let's separate the leader and the rest of the team
  const leader = team.find(member => member.is_pimpinan) || team[0];
  const others = team.filter(member => !member.is_pimpinan);

  return (
    <section id="tim" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Tim Hukum
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold leading-tight mb-6">
            Pakar Hukum Bisnis &<br />Perlindungan Konsumen
          </h2>
          <p className="text-muted-foreground text-lg">
            Didukung oleh tim lawyer, legal analyst, dan negosiator yang bekerja
            secara sistematis untuk memenangkan perkara Anda.
          </p>
        </motion.div>

        {leader && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="group relative rounded-xl overflow-hidden bg-card border border-border p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 aspect-[3/4] relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10 opacity-80 md:opacity-50" />
                <SafeImage
                  src={leader.foto_url}
                  alt={leader.nama}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-center relative z-20">
                <span className="text-primary font-medium tracking-wider text-sm mb-2 block">
                  {leader.jabatan}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-4">
                  {leader.nama}
                </h3>
                <p className="text-primary/80 text-sm mb-6 border-l-2 border-primary pl-4 italic">
                  {leader.spesialisasi}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {leader.bio || 'Praktisi hukum berpengalaman yang memimpin tim dengan ketajaman analisa dan kekuatan strategi penyelesaian sengketa.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {others.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-card border border-border aspect-[3/4] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent z-10 opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
              <SafeImage
                src={member.foto_url}
                alt={member.nama}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-primary font-medium tracking-wider text-xs mb-2 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {member.jabatan}
                </span>
                <h3 className="font-serif text-2xl text-foreground font-bold mb-2">
                  {member.nama}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {member.spesialisasi}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



