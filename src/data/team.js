/** Fotos: colocar ficheiros em public/team/ e definir photo: "/team/nome.jpg" */
export const TEAM_MEMBERS = [
  {
    name: "Vilma Domingos",
    role: "Gestora de Projetos",
    photo: null,
    social: { linkedin: "https://www.linkedin.com/in/vilma-domingos-6939422a9/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BM45z7bemQcSpxJBZzXlKOg%3D%3D", instagram: "#", github: "#" },
  },
  {
    name: "Afonso Fernando",
    role: "Desenvolvedor Front-end",
    photo: null,
    social: { linkedin: "https://www.linkedin.com/in/afonso-fernando-b72847339/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B1XTJfl8fQJmA80iu3%2BBM%2BA%3D%3D", instagram: "#", github: "#" },
  },
  {
    name: "Elizio Kela",
    role: "Desenvolvedor Front-end",
    photo: null,
    social: { linkedin: "https://www.linkedin.com/in/elizio-kela-b16490339/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B6WtN3UyjTXeJQB%2FuZ5i6Xw%3D%3D", instagram: "#", github: "#" },
  },
  {
    name: "Manuel Tomás",
    role: "Desenvolvedor Full-stack",
    photo: null,
    social: { linkedin: "https://www.linkedin.com/in/manuel-diogo-tomas-5001a32a6/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BAWLu6%2FhYRSelOGzidDxl9w%3D%3D", instagram: "#", github: "#" },
  },
];

export function memberInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
