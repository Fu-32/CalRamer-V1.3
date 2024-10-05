const Features = () => {
    return (
      <section id="features" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center white">Nos Fonctionnalités</h2>
          <div className="mt-12 flex flex-wrap">
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800">Fonctionnalité 1</h3>
                <p className="mt-2 text-gray-600">Description de la fonctionnalité 1.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800">Fonctionnalité 2</h3>
                <p className="mt-2 text-gray-600">Description de la fonctionnalité 2.</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800">Fonctionnalité 3</h3>
                <p className="mt-2 text-gray-600">Description de la fonctionnalité 3.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  };
 
  export default Features;