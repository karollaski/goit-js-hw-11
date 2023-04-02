import axios from 'axios';
import Notiflix from 'notiflix';

const NotiflixOptions = {
  distance: '2px',
  cssAnimationStyle: 'from-right',
  showOnlyTheLastOne: 'true',
};

const keyApi = '34929900-bebe558fd922fdc941c0226a3';

const getPhotos = async (name, page = 1, per_page = 40, message) => {
  const response = await axios.get(
    `https://pixabay.com/api/?key=${keyApi}&q=${name}&page=${page}&per_page=${per_page}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  if (response.status !== 200) {
    console.log('oops!');
    throw new Error(response.status);
  }
  if (response.data.total === 0) {
    Notiflix.Notify.warning(message, NotiflixOptions);
  }
  const data = await response.data;
  // console.log(data);
  return data;
};

export { getPhotos };
