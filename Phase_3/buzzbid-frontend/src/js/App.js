import { Routes, Route } from 'react-router-dom';

import Login from './views/login';
import Register from "./views/register";
import MainMenu from './views/mainmenu';
import AuctionStatisticsReport from './views/auctionStatsReport';
import CategoryReport from './views/categoryReport';
import UserReport from './views/userReport';
import TopRatedReport from './views/topRatedReport';
import CancelledAuctionsReport from './views/cancelledAuctionsReport';
import SearchForm from './views/searchForm';
import SearchResults from './views/searchResults';
import AuctionResults from './views/auctionResults';
import ListMyItem from './views/listItem';
import ItemResults from './views/itemResults';
import ViewRatings from './views/viewRatings';
import ItemForSale from './views/itemForSale';

const App = () => {
  return (
    <>
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mainmenu" element={<MainMenu />} />
          <Route path="/search" element={<SearchForm />} />
          <Route path="/searchResults" element={<SearchResults />} />
          <Route path="/itemForSale" element={<ItemForSale />} />
          <Route path="/listItem" element={<ListMyItem />} />
          <Route path="/auctionResults" element={<AuctionResults />} />
          <Route path="/itemResults" element={<ItemResults />} />
          <Route path="/viewRatings" element={<ViewRatings />} />
          <Route path="/reports/category" element={<CategoryReport />} />
          <Route path="/reports/user" element={<UserReport />} />
          <Route path="/reports/topRatedItems" element={<TopRatedReport />} />
          <Route path="/reports/auctionStats" element={<AuctionStatisticsReport />} />
          <Route path="/reports/cancelledAuctions" element={<CancelledAuctionsReport />} />
       </Routes>
    </>
 );
}

export default App;