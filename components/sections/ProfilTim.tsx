"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { motion } from "framer-motion";
import Link from "next/link";

interface TeamMember {
  id: string;
  slug: string;
  nama: string;
  jabatan: string;
  spesialisasi: string;
  foto_url: string;
  bio?: string | null;
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
    <section id="tim" className="py-24 bg-[#00365A]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-white/60 uppercase tracking-[0.2em] text-sm font-medium mb-4 block">
            Tim Hukum
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
            Pakar Hukum Bisnis &<br />Perlindungan Konsumen
          </h2>
          <p className="text-white/70 text-lg">
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
            className="mb-10 max-w-3xl mx-auto"
          >
            <Link href={`/tim/${leader.slug}`} className="block">
              <div className="group relative rounded-xl overflow-hidden bg-[#002B47] border border-white/10 p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg">
                <div className="w-full md:w-1/3 aspect-[3/4] relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002B47] to-transparent z-10 opacity-80 md:opacity-50" />
                  <SafeImage
                    src={leader.foto_url}
                    alt={leader.nama}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="w-full md:w-2/3 flex flex-col justify-center relative z-20">
                  <span className="text-white/60 font-medium tracking-wider text-xs mb-2 block">
                    {leader.jabatan}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mb-3">
                    {leader.nama}
                  </h3>
                  <p className="text-[#008AE6] text-sm mb-4 border-l-2 border-[#008AE6] pl-4 italic">
                    {leader.spesialisasi}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed mb-2">
                    {leader.bio || 'Praktisi hukum berpengalaman yang memimpin tim dengan ketajaman analisa dan kekuatan strategi penyelesaian sengketa.'}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {others.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="shadow-lg"
            >
              <Link href={`/tim/${member.slug}`} className="group relative block rounded-xl overflow-hidden bg-[#002B47] border border-white/10 aspect-[4/5]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#002B47] via-[#002B47]/80 to-transparent z-10 opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
                <SafeImage
                  src={member.foto_url}
                  alt={member.nama}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[#008AE6] font-medium tracking-wider text-[10px] mb-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {member.jabatan}
                  </span>
                  <h3 className="font-serif text-xl text-white font-bold mb-1">
                    {member.nama}
                  </h3>
                  <p className="text-white/70 text-xs">
                    {member.spesialisasi}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}





