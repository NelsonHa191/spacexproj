import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import { Rocket, Home, Calendar, Info, Menu, X, Search, ChevronDown } from 'lucide-react';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

const GET_LAUNCHES = gql`
  query GetLaunches {
    launches {
      id
      mission_name
      launch_date_utc
      details
      success
      links {
        mission_patch
      }
      rocket {
        rocket_name
      }
    }
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Rocket className="text-blue-500 h-8 w-8" />
            <span className="text-white font-bold ml-2">SpaceX Explorer</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavLink icon={<Home size={18} />} text="Home" />
            <NavLink icon={<Calendar size={18} />} text="Launches" />
            <NavLink icon={<Info size={18} />} text="About" />
            <SearchBar />
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-gray-900 pb-4 px-4">
          <NavLink icon={<Home size={18} />} text="Home" mobile />
          <NavLink icon={<Calendar size={18} />} text="Launches" mobile />
          <NavLink icon={<Info size={18} />} text="About" mobile />
          <SearchBar mobile />
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ icon, text, mobile }) => (
  <button 
    className={`flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700 
    ${mobile ? 'w-full p-3 rounded-md my-1' : 'px-3 py-2 rounded-md'}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

const SearchBar = ({ mobile }) => (
  <div className={`relative ${mobile ? 'w-full' : 'w-64'}`}>
    <input
      type="text"
      placeholder="Search launches..."
      className="w-full bg-gray-700 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
  </div>
);

const HeroSection = () => (
  <div className="bg-gray-900 text-white py-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore SpaceX Launches</h1>
      <p className="text-xl mb-8">Discover past and upcoming missions</p>
      <ChevronDown className="mx-auto animate-bounce cursor-pointer" size={32} />
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Rocket className="text-blue-500 animate-spin" size={48} />
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="text-red-500 text-center p-4">
    Error: {error.message}
  </div>
);

const LaunchCard = ({ launch }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow 
    ${launch.success === false ? 'border-l-4 border-red-500' : 
      launch.success === true ? 'border-l-4 border-green-500' : ''}`}>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{launch.mission_name}</h3>
      <p className="text-gray-600">
        {new Date(launch.launch_date_utc).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mt-4">{launch.details || 'No details available'}</p>
      <div className="mt-2">
        <span className={`px-2 py-1 rounded text-sm ${
          launch.success === true ? 'bg-green-100 text-green-800' :
          launch.success === false ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {launch.success === true ? 'Successful' :
           launch.success === false ? 'Failed' :
           'Unknown'}
        </span>
      </div>
    </div>
  </div>
);

const MainContent = () => {
  const { loading, error, data } = useQuery(GET_LAUNCHES);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <div className="pt-16">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search missions..."
            className="w-full md:w-96 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <FilterButtons filter={filter} setFilter={setFilter} />
        <LaunchGrid 
          loading={loading} 
          error={error} 
          data={data} 
          filter={filter}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

const FilterButtons = ({ filter, setFilter }) => (
  <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
    {['all', 'upcoming', 'past', 'successful', 'failed'].map((type) => (
      <button
        key={type}
        onClick={() => setFilter(type)}
        className={`px-4 py-2 rounded-full capitalize whitespace-nowrap
        ${filter === type 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
      >
        {type}
      </button>
    ))}
  </div>
);

const LaunchGrid = ({ loading, error, data, filter, searchQuery }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  const filterLaunches = (launches) => {
    const now = new Date();
    
    return launches.filter(launch => {
      const launchDate = new Date(launch.launch_date_utc);
      const missionName = launch.mission_name || '';
      const matchesSearch = missionName.toLowerCase().includes(searchQuery);
      
      switch (filter) {
        case 'upcoming':
          return launchDate > now && matchesSearch;
        case 'past':
          return launchDate < now && matchesSearch;
        case 'successful':
          return launch.success === true && matchesSearch;
        case 'failed':
          return launch.success === false && matchesSearch;
        default:
          return matchesSearch;
      }
    });
  };

  const sortedAndFilteredLaunches = filterLaunches(data.launches)
    .sort((a, b) => new Date(b.launch_date_utc) - new Date(a.launch_date_utc));

  return (
    <>
      <div className="mb-4 text-gray-600">
        Found {sortedAndFilteredLaunches.length} launches
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredLaunches.map(launch => (
          <LaunchCard key={launch.id} launch={launch} />
        ))}
      </div>
    </>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <MainContent />
      </div>
    </ApolloProvider>
  );
};

export default App;