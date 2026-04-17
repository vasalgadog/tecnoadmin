import BreadRegistration from '../components/BreadRegistration';
import OrderRegistration from '../components/OrderRegistration';

export default function Inicio() {
  return (
    <>
      <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start max-w-[1440px] mx-auto">
          
          {/* Panel 1: Bread Registration */}
          <section className="xl:col-span-5 space-y-6 flex-1">
             <BreadRegistration />
          </section>

          {/* Panel 2: Order Registration */}
          <section className="xl:col-span-7 flex-1">
             <OrderRegistration />
          </section>
          
        </div>
      </div>
    </>
  );
}
