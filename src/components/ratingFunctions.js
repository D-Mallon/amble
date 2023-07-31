import communityIcon from '/static/images/community_icon.png';
import museumArtIcon from '../../static/images/museum_art_icon.png';
import worshipIcon from '../../static/images/worship_icon.png';
import libraryIcon from '../../static/images/library_icon.png';
import parkIcon from '/static/images/park_icon.png';
import cafeIcon from '../../static/images/cafe_icon.png';
import restaurantIcon from '../../static/images/restaurant_icon.png';

export const getIconByType = (type) => {
  switch (type) {
    case 'community':
      return communityIcon;
    case 'museum_art':
      return museumArtIcon;
    case 'worship':
      return worshipIcon;
    case 'library':
      return libraryIcon;
    case 'cafe':
      return cafeIcon; 
    case 'restaurant':
      return restaurantIcon;
  
    default:
      return parkIcon;
  }
};
