import { addDays, format, parseISO } from "date-fns";

export function storeCookie(key, value) {
  document.cookie = `${key}=${value};SameSite=Strict`;
}

export function getCookie(key) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${key}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  } else {
    return "";
  };
}

export function formatDate(dateString) {
  return `${format(parseISO(String(dateString)), "M/d/yyyy h:mm a")}`;
}

export function calculateDaysAfterCurrentDate(numDays) {
  const time_now = new Date().toISOString();
  const futureDate = addDays(parseISO(time_now), parseInt(numDays)).toISOString();
  return `${futureDate.substring(0, 10)} ${futureDate.substring(11, 19)}`;
}

export function validateItemDates(minBidAmount, minSalePrice, getItNowPrice) {
  if (minBidAmount > minSalePrice) {
    return "Minimum Bid Amount has to be lower than Minimum Sale Price";
  }

  if (getItNowPrice) {
    if (getItNowPrice < minBidAmount) {
      return "Get It Now Price has to be greater than Minimum Bid Amount";
    }

    if (getItNowPrice < minSalePrice) {
      return "Get It Now Price has to be greater than Minimum Sale Price";
    }
  }

  return "";
}