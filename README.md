# Vantage Row

A marketplace front end for buying and selling second-hand luxury cars.
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy on GitHub Pages
1. Create a repository and push these files to the `main` branch.
2. Open Settings > Pages, set Source to "Deploy from a branch", choose `main` and `/ (root)`, then save.
3. The site goes live at `https://<your-username>.github.io/<repo-name>/`.

## Files
- `index.html` page structure
- `style.css` styles, light and dark themes
- `app.js` listings data, filters, car detail view, offer form, sell form
- `images/` car photos

## Add or edit cars
Edit the `LISTINGS` array in `app.js` and add the photo to `images/`.

## Notes
- The six listings are sample data. Prices, inspection scores and cities are made up.
- There is no backend. Listings from the sell form, offers and viewing requests are not saved or sent anywhere. Only the shortlist is kept, in the visitor's browser.
- Check that you have the right to use each photo before making the repository public.
