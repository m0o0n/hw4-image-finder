import { fetchImages } from 'api/api';
import { Component } from 'react';
import Button from './Button';
import ImageGallery from './ImageGallery';
import { Loader } from './Loader';
import SearchBar from './Searchbar';

export class App extends Component {
  state = {
    gallery: null,
    filtedGalery: null,
    query: '',
    page: 1,
    err: '',
    isLoading: true,
  };

  handleLoadMore = () => {
    this.setState(prev => ({ page: prev.page + 1 }));
  };

  submit = value => {
    fetchImages(this.state.page, value)
      .then(data => {
        this.setState({ gallery: data.hits, query: value });
      })
      .catch(err => {
        this.setState({ err, isLoading: false });
      });
  };

  componentDidUpdate(_, prevState) {
    if (prevState.page !== this.state.page) {
      this.setState({ isLoading: true });
      fetchImages(this.state.page, this.state.query).then(data => {
        setTimeout(() => {
          this.setState(prev => ({
            gallery: [...prev.gallery, ...data.hits],
            isLoading: false,
          }));
        }, 500);
      });
    }
  }

  componentDidMount() {
    if (!Boolean(this.state.query)) {
      this.setState({ gallery: [], isLoading: false });
    }
    fetchImages(this.state.page)
      .then(({ hits }) => {
        setTimeout(() => {
          this.state.query
            ? this.setState({ gallery: hits, isLoading: false })
            : this.setState({ gallery: [], isLoading: false });
        }, 500);
      })
      .catch(err => {
        this.setState({ err, isLoading: false });
      });
  }

  render() {
    return (
      <div className="App">
        <SearchBar submit={this.submit} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <ImageGallery gallery={this.state.gallery} />
            <Button
              loadMore={this.handleLoadMore}
              isRender={this.state.gallery.length}
              page={this.state.page}
            />
          </>
        )}
      </div>
    );
  }
}
