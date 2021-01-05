const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEL = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

//Show Modal, Focus on input 
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

//Modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal'): false));


//Vaslidate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submite values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid url');
        return false;
    }
    //Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark) => {
      const { name, url } = bookmark;
      // Item
      const item = document.createElement('div');
      item.classList.add('item');
      // Close Icon
      const closeIcon = document.createElement('i');
      closeIcon.classList.add('fas', 'fa-trash-alt');
      closeIcon.setAttribute('title', 'Delete Bookmark');
      closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
      // Favicon / Link Container
      const linkInfo = document.createElement('div');
      linkInfo.classList.add('name');
      // Favicon
      const favicon = document.createElement('img');
      favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
      favicon.setAttribute('alt', 'Favicon');
      // Link
      const link = document.createElement('a');
      link.setAttribute('href', `${url}`);
      link.setAttribute('target', '_blank');
      link.textContent = name;
      // Append to bookmarks container
      linkInfo.append(favicon, link);
      item.append(closeIcon, linkInfo);
      bookmarksContainer.appendChild(item);
    });
  }

//Fetch bookmarks from local storage
function fetchBookmarks() {
    //Get bookmarks if available
    if (localStorage.getItem('bookmarks')){ 
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        //Create bookmarks array in local storage
        bookmarks = [
            {
                name: 'whatev',
                url: 'https://espn.com',
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } 
    buildBookmarks();
}

//Delete Bookmarks
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    //update bookmarks array in local-storage, repopulate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Form submit handling
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEL.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
     urlValue = `https://${urlValue}`; 
}
    if(!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);


//OnLoad
fetchBookmarks();



