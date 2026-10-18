/** Fotos: colocar ficheiros em public/team/ e definir photo: "/team/nome.jpg" */
export const TEAM_MEMBERS = [
  {
    name: "Vilma Domingos",
    role: "Gestora de Projetos",
    photo: null,
    social: { linkedin: "#", instagram: "#", github: "#" },
  },
  {
    name: "Afonso Fernando",
    role: "Desenvolvedor Front-end",
    photo: null,
    social: { linkedin: "#", instagram: "#", github: "#" },
  },
  {
    name: "Elizio Kela",
    role: "Desenvolvedor Front-end",
    photo: null,
    social: { linkedin: "#", instagram: "#", github: "#" },
  },
  {
    name: "Manuel Tomás",
    role: "Desenvolvedor Full-stack",
    photo: null,
    social: { linkedin: "#", instagram: "#", github: "#" },
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
