const PASOS = [
  { titulo: "Elige tu figura", texto: "Revisa el catálogo y filtra por categoría." },
  { titulo: "Consulta por WhatsApp", texto: "El mensaje llega con la figura ya indicada, así sabes al tiro si hay stock." },
  { titulo: "Coordina pago y entrega", texto: "Acuerdan el medio de pago y el retiro o despacho." },
];

export function ComoComprar() {
  return (
    <section id="como-comprar" className="scroll-mt-20 border-y border-borde bg-tarjeta">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:gap-8 md:py-16">
        <h2 className="font-titulo text-[26px] font-medium md:text-[32px]">Cómo comprar</h2>
        <ol className="flex flex-col gap-5 md:flex-row md:gap-6">
          {PASOS.map((paso, i) => (
            <li key={paso.titulo} className="flex flex-1 gap-4 md:flex-col md:gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-acento bg-fondo font-titulo font-medium md:size-10">
                {i + 1}
              </span>
              <div>
                <h3 className="font-titulo text-lg font-medium md:text-xl">{paso.titulo}</h3>
                <p className="mt-0.5 text-[15px] text-texto-suave md:text-base">{paso.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
