import BreadRegistration from '../components/BreadRegistration';
import OrderRegistration from '../components/OrderRegistration';

export default function Inicio() {
  return (
    <>
      <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 min-[700px]:grid-cols-12 gap-6 items-start max-w-[1440px] mx-auto">
          
          {/* Panel 1: Order Registration (Left) */}
          <section className="min-[700px]:col-span-12 flex-1">
             <OrderRegistration />
          </section>

          {/* Panel 2: Bread Registration (Right - Oculto según Paso 1.3) */}
          <section style={{ display: 'none' }} className="min-[700px]:col-span-5 space-y-6 flex-1">
             <BreadRegistration />
          </section>
          
        </div>
      </div>
    </>
  );
}
