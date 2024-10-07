const Pricing = () => {
  return (
    <section id="pricing" className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Nos Tarifs</h2>
        <div className="mt-12 flex justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3 p-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800">Basique</h3>
              <p className="mt-2 text-gray-600">À partir de 9,99€/mois</p>
              <ul className="mt-2 text-gray-600 list-disc list-inside">
                <li>Fonctionnalité 1</li>
                <li>Fonctionnalité 2</li>
                <li>Fonctionnalité 3</li>
                <li>Fonctionnalité 4</li>
              </ul>
              <button className="mt-6 px-6 py-2 bg-accent text-white rounded-full hover:bg-accent-focus">
                Choisir
              </button>
            </div>
          </div>
          {/* Répétez pour d'autres plans tarifaires */}
        </div>
      </div>
    </section>
  );
};

export default Pricing;