// IMPORTS
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotos } from './js/getPhotos';

// DOM ELEMENTS
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('hidden-btn');

const PER_PAGE = 40;

const NotiflixOptions = {
  distance: '2px',
  cssAnimationStyle: 'from-right',
  showOnlyTheLastOne: 'true',
};

const lightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;

const renderGallery = data => {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}"><img class="small-photo" src="${webformatURL}" alt="${tags}" loading="lazy" /> </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`
    )
    .join('');
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  const { searchQuery } = e.currentTarget;
  searchInput = searchQuery.value.trim();
  try {
    const data = await getPhotos(
      searchInput,
      pageNumber,
      PER_PAGE,
      'Sorry, there are no images matching your search query. Please try again.'
    );

    const totalHits = data.total;
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    if (searchInput !== '') {
      const markupPhoto = renderGallery(data.hits);
      gallery.innerHTML = markupPhoto;

      loadMoreBtn.classList.remove('hidden-btn');
      lightbox.refresh();
    } else {
      gallery.innerHTML = '';
      loadMoreBtn.classList.add('hidden-btn');
    }
  } catch (error) {
    console.log(error);
  }
});

loadMoreBtn.addEventListener('click', async e => {
  e.preventDefault();
  try {
    pageNumber += 1;
    const data = await getPhotos(
      searchInput,
      pageNumber,
      PER_PAGE,
      'Sorry, there are no images matching your search query. Please try again.'
    );
    const totalPages = data.total / PER_PAGE;
    if (totalPages < pageNumber) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results.",
        NotiflixOptions
      );
      loadMoreBtn.classList.add('hidden-btn');
    }
    const markupMorePhoto = renderGallery(data.hits);
    gallery.innerHTML += markupMorePhoto;
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
});
