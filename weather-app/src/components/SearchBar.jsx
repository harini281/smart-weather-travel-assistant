import "../App.css";

function SearchBar({

  city,
  setCity,
  getWeather,
  getCurrentLocationWeather

}) {

  return (

    <div className="search-box">

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>
        Search
      </button>

      <button onClick={getCurrentLocationWeather}>
        Current Location
      </button>

    </div>

  );

}

export default SearchBar;