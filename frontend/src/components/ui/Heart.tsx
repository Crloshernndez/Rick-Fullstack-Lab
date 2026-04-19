// src/components/ui/Heart.tsx
import { cn } from "@/lib/utils"; // Asumiendo que usas la utilidad clsx/cn estándar

interface HeartProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Estado: true si es favorito (corazón lleno), false si no (borde)
  isStarred?: boolean;
  // Opcional: para forzar el tamaño si no se usa dentro de la clase .btn-icon-heart
  size?: "sm" | "md";
}

export function Heart({
  isStarred = false,
  size = "md",
  className,
  ...props
}: HeartProps) {
  // Definimos las dimensiones internas del SVG basadas en la clase padre
  // Si el padre es .btn-icon-heart (32px padding 4px), el SVG interno debe ser ~24px
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <button
      type="button"
      className={cn(
        // 1. ESTILOS BASE (La clase que definimos en el CSS global)
        "btn-icon-heart",

        // 2. ESTILOS DINÁMICOS SEGÚN ESTADO (isStarred)
        isStarred
          ? [
              // Estado Activo (Lleno)
              "bg-brand-light", // Fondo Lavanda sutil #EEE3FF
              "text-brand-success", // Corazón Verde vibrante #63D838
              "opacity-100", // Opacidad total
              "shadow-sm shadow-brand-success/10", // Sombra suave verde
              "hover:bg-brand-success/10", // Hover sutil
            ]
          : [
              // Estado Inactivo (Borde)
              "bg-transparent", // Sin fondo
              "text-slate-300", // Color gris muy suave (placeholder)
              "opacity-40 group-hover:opacity-100", // Sutil, pero resalta en hover del item
              "hover:bg-slate-50", // Hover sutil
              "hover:text-slate-400", // Oscurece un poco en hover
            ],

        // 3. CLASES EXTERNAs (para posicionamiento, etc.)
        className
      )}
      {...props}
    >
      {/* El SVG hereda 'currentColor' (text-brand-success o text-slate-300) */}
      <svg
        className={iconSize}
        viewBox="0 0 24 24"
        fill={isStarred ? "currentColor" : "none"} // Relleno solo si es starred
        stroke="currentColor"
        strokeWidth={isStarred ? "1" : "2"} // Trazo más fino si está lleno
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
