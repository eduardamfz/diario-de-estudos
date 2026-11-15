// Ícone do Diário de Estudos: um caderno roxo com uma faísca.
export default function Logo({ tamanho = 36 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#6D28D9" />
      <rect x="19" y="13" width="28" height="38" rx="5" fill="#fff" />
      <rect x="13" y="19" width="11" height="4" rx="2" fill="#DDD6FE" />
      <rect x="13" y="27" width="11" height="4" rx="2" fill="#DDD6FE" />
      <rect x="13" y="35" width="11" height="4" rx="2" fill="#DDD6FE" />
      <rect x="13" y="43" width="11" height="4" rx="2" fill="#DDD6FE" />
      <rect x="29" y="25" width="14" height="3" rx="1.5" fill="#8B5CF6" />
      <rect x="29" y="32" width="10" height="3" rx="1.5" fill="#C4B5FD" />
      <rect x="29" y="39" width="14" height="3" rx="1.5" fill="#C4B5FD" />
      <path d="M39 13h6v15l-3-2.4-3 2.4z" fill="#A78BFA" />
      <path d="M52 8l1.4 3.6L57 13l-3.6 1.4L52 18l-1.4-3.6L47 13l3.6-1.4z" fill="#EDE9FE" />
    </svg>
  );
}
