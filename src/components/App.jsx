import { fetchImages } from 'api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import Button from './Button';
import ImageGallery from './ImageGallery';
import { Loader } from './Loader';
import SearchBar from './Searchbar';

export const App = () => {

  const [state, setState] = useState({
    gallery: [],
    filtedGalery: null,
    query: '',
    totalHits: null,
    page: 1,
    err: '',
    isLoading: false,
  })
  const handleLoadMore = () => {
    setState({
      ...state,
      isLoading: true,
      page: state.page + 1
    });
  };

  const submit = value => {
    setState({
      ...state,
      page: 1,
      isLoading: true,
      query: value,
      gallery: [],
      totalHits: null
    })
  };


  useEffect(() => {
    fetchImages(state.page, state.query).then((data) => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          gallery: prev.query ? [...prev.gallery, ...data.hits] : [],
          totalHits: data.totalHits,
          isLoading: false
        }))
      }, 500)
    }).catch(err => {
      setState((prev) => ({ ...prev, err }))
    })
  }, [state.query, state.page])


  return (
    <div className="App">
      <SearchBar submit={submit} />
      {state.isLoading ? (
        <Loader />
      ) : (
        <>
          <ImageGallery gallery={state.gallery} />
          <Button
            loadMore={handleLoadMore}
            isRender={state.gallery.length && (state.totalHits > state.gallery.length)}
          />
        </>
      )}
    </div>
  );

}
