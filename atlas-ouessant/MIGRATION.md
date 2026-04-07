# Migration & Testing Guide

## Quick Start

### Step 1: Verify File Structure
```bash
# From appli directory, verify js/ folder exists:
ls -la js/
# Should show: utils.js, config.js, image-manager.js, panel-manager.js, 
#              layer-manager.js, legend-manager.js, app.js
```

### Step 2: Test in Browser
1. Open `visualisateur.html` in Chrome/Firefox
2. Check **DevTools Console** for errors
3. Verify map displays correctly
4. Test each feature:

---

## Feature Verification Checklist

### ✅ Map Initialization
- [ ] Map loads centered on Ouessant
- [ ] Zoom controls visible
- [ ] "Me situer" (locate) button works
- [ ] Scale bar shows at bottom left

### ✅ Base Map Layers
- [ ] "Cartes actuelles" section has IGN/OSM options
- [ ] "Images aériennes" section toggles between years
- [ ] "Cartes anciennes" section loads historical maps
- [ ] "Cadastre ancien" section works
- [ ] Layer opacity controls work (where enabled)

### ✅ Patrimoine Culturel Layers

#### Lavoirs et Fontaines
- [ ] Layer toggle shows/hides markers
- [ ] Legend updates when toggled on/off
- [ ] Marker colors change when style mode changes
- [ ] Click marker → panel shows feature data
- [ ] Images load in panel (if available)
- [ ] Image captions display (author - date)
- [ ] 3 style modes work:
  - [ ] Type (lavoir/fontaine colors)
  - [ ] Precision (exacte/affinée/etc colors)
  - [ ] Statut (existant/détruit colors)

#### Moulins
- [ ] Layer toggle shows/hides markers
- [ ] Marker icons change (grand/petit moulin SVGs)
- [ ] Legend shows for each style mode
- [ ] Click marker → panel shows moulin details
- [ ] Moulin groups can be toggled:
  - [ ] "Petits moulins 19e"
  - [ ] "Grands moulins 1842"
  - [ ] "Autres"
- [ ] Group visibility filters correctly
- [ ] Marker clustering works (zoom in/out)
- [ ] Cluster counter shows correct number

#### Lieux-dits
- [ ] Layer toggle shows/hides polygons
- [ ] Click polygon → highlights blue + shows name in panel
- [ ] Tooltip shows lieu-dit name on hover
- [ ] Clicking another polygon deselects previous

### ✅ Feature Panel

#### Lavoirs Data Display
- [ ] Shows: Type, Nom, Statut, Precision, Source
- [ ] Shows: Traces on 1910 plan (Oui/Non)
- [ ] Shows: Traces on 1842 cadastre (Oui/Non)
- [ ] Shows description if available
- [ ] Shows commentaire_st if available
- [ ] Shows images with captions when available

#### Moulins Data Display
- [ ] Shows: Type moulin
- [ ] Shows: Nom
- [ ] Shows: Source
- [ ] Shows: Date de construction (if present)
- [ ] Shows: Date de mise à l'arrêt (if present)
- [ ] Shows: Date de démolition (if present)
- [ ] Shows: Existant status with (rénové)/(en ruines) notes

#### Panel Loading State
- [ ] Shows "Chargement des images..." spinner while loading
- [ ] Spinner disappears when images load
- [ ] Images display in figures with proper alt text
- [ ] Image links open in new tab

### ✅ Legend Panel
- [ ] Updates when layer visibility changes
- [ ] Shows appropriate legend for each visible layer
- [ ] Style mode dropdowns work and update colors
- [ ] Group checkboxes toggle moulins visibility
- [ ] Empty state shown when no layers visible

---

## Browser DevTools Debugging

### Check Console for Errors
```javascript
// Open DevTools: F12
// Check Console tab
// Should show NO red errors, only "Application initialized"
```

### Verify Module Loading
```javascript
// In Console, type:
typeof ImageManager
// Should return: "function"

typeof PanelManager
// Should return: "function"

typeof LayerManager
// Should return: "function"

app.state
// Should show: { lavoirsStyleMode: ..., moulinsStyleMode: ..., ... }
```

### Test Image Loading
```javascript
// Click on a lavoir with ID 49 (Fontaine du Croazou)
// In Console, type:
app.lavoirsImageManager.resolveImages(['49']).then(urls => console.log(urls))
// Should return: ['./img/library/Terrain/lavoirs_et_fontaines/49.jpg', ...]
```

### Check Layer Data
```javascript
// Get all lavoirs features
app.layerManagers.lavoirs.getData()
// Should show GeoJSON FeatureCollection with 75+ features

// Check specific feature ID field
app.layerManagers.lavoirs.getData().features[0].properties
// Should have either 'fid', 'Id', or 'id' field
```

---

## Common Issues & Solutions

### Issue: Blank Map
**Cause:** Tiles.js hasn't loaded
**Solution:** Check browser Network tab → Verify `tiles.js` loads before `app.js`

### Issue: "Cannot read property 'bindTooltip' of null"
**Cause:** Layer tried to attach handlers before GeoJSON loaded
**Solution:** Check that `loadData()` completes before layer is added to map (should be automatic)

### Issue: Images don't load in panel
**Cause:** Image paths incorrect or credits.json missing
**Solution:** 
1. Check browser Network tab → Look for 404 errors on image requests
2. Verify folder structure: `img/library/Terrain/lavoirs_et_fontaines/`
3. Verify credits.json exists at that path

### Issue: Legend dropdown doesn't change colors
**Cause:** Event listener not attached
**Solution:** 
1. Open DevTools → check `app.legendManager`
2. Try manually changing style: `app.layerManagers.lavoirs.applyStyleMode('statut')`
3. Check that L.geoJson layer exists: `app.layerManagers.lavoirs.geoJsonLayer`

### Issue: Moulins not showing
**Cause:** Could be clustering issue or no data loaded
**Solution:**
1. Check: `app.layerManagers.moulins.getData()`
2. Check: `app.layerManagers.moulins.cluster` exists
3. Try: `app.map.fitBounds(app.layerManagers.moulins.cluster.getBounds())`

---

## Performance Baseline

These are expected times (Chrome DevTools, Network: Fast 3G):

- **Page load → map visible:** ~2 seconds
- **All layers loaded:** ~3 seconds
- **Click marker → images appear:** ~400ms (first time, cached after)
- **Change style mode:** ~100ms (instant to user)
- **Toggle layer visibility:** ~50ms
- **Toggle moulin group:** ~150ms (refresh + clustering)

---

## Testing Scenarios

### Scenario 1: Full User Workflow
```
1. Load page → map appears
2. Open "Patrimoine culturel" → click "Lavoirs et fontaines"
3. Layer appears with 75+ blue/green markers
4. Click marker with ID 49 (Fontaine du Croazou, near northeast coast)
5. Panel shows details + 1 image (49.jpg)
6. Change legend "Coloration" dropdown to "Statut"
7. All markers change to statut colors (existant=green, détruit=brown)
8. Click "Moulins" in layer control
9. Moulin markers appear (grand/petit moulin icons)
10. Legend shows moulins legend with moulin group checkboxes
11. Uncheck "Autres" group → some moulin markers disappear
12. Re-check to show again
```

### Scenario 2: Image Loading Test
```
1. Toggle Lavoirs layer on
2. Click on feature with ID 49
3. Observe "Chargement..." spinner
4. Wait for image to load (~500ms)
5. Verify caption shows "Solenn Tual - 02-11-2025"
6. Click on feature with ID 4 (also has image)
7. Panel updates to show different image
8. Click on feature with no image (e.g., ID 0)
9. Panel shows "Images" section empty (correct)
```

### Scenario 3: Cross-browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if mac)
- [ ] Edge (if windows)

All should work identically.

---

## Rollback Plan

If issues occur and you need to return to old code:

### Option 1: Revert HTML
```html
<!-- Change this: -->
<script src="js/app.js"></script>

<!-- Back to: -->
<script src="visualisateur.js"></script>
```

Old `visualisateur.js` is unchanged and still exists.

### Option 2: Delete new modules
Keep old code as fallback:
```bash
# Keep old file in place
mv appli/visualisateur.js appli/visualisateur.js.backup
# Or just don't load new modules in HTML
```

---

## Success Criteria

You'll know the refactor was successful when:

1. ✅ All layers load and display correctly
2. ✅ All interactions work (clicks, dropdowns, checkboxes)
3. ✅ No console errors
4. ✅ Images load with captions
5. ✅ Legend updates on visibility changes
6. ✅ Browser DevTools shows `app` object with all managers
7. ✅ Page feels responsive (no lag on interactions)

---

## Next Steps (Optional Enhancements)

1. **ES6 Migration**
   - Convert to `export`/`import` syntax
   - Use webpack or rollup for bundling
   - Gain tree-shaking benefits

2. **Unit Tests**
   - Test each manager in isolation
   - Use Jest or Mocha framework
   - ~80% code coverage target

3. **TypeScript**
   - Add type definitions
   - Catch errors at build time
   - Better IDE autocompletion

4. **Documentation**
   - JSDoc comments (already added)
   - Interactive API docs
   - Dev environment setup guide

---

**Questions?** Check `ARCHITECTURE.md` for detailed module information.
