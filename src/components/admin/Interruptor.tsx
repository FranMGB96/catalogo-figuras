type Props = {
  activo: boolean;
  onCambiar: (valor: boolean) => void;
  etiqueta: string;
  deshabilitado?: boolean;
};

/** Interruptor tipo sí/no, grande y fácil de tocar en el celular. */
export function Interruptor({ activo, onCambiar, etiqueta, deshabilitado = false }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      disabled={deshabilitado}
      onClick={() => onCambiar(!activo)}
      className="flex min-h-11 cursor-pointer items-center gap-3 disabled:cursor-wait disabled:opacity-60"
    >
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          activo ? "bg-[#15803d]" : "bg-[#d6d3d1]"
        }`}
      >
        <span
          className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform duration-200 ${
            activo ? "translate-x-5" : ""
          }`}
        />
      </span>
      <span className="text-[15px] font-semibold">{etiqueta}</span>
    </button>
  );
}
