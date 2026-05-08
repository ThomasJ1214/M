# BMW M Showcase — 3D Model Files

Drop a `model.glb` file into each folder below.
The site auto-detects whether each file exists:
- **File present** → loads and renders the real 3D model
- **File missing** → shows the procedural geometry + "3D Model · Coming Soon" badge

## Where to get free GLB files

- **Sketchfab** (sketchfab.com) — search "BMW M3", "BMW M5" etc. Filter by "Downloadable". Many free CC0/CC-BY models.
- **CGTrader** (cgtrader.com) — free section has BMW models
- **TurboSquid** (turbosquid.com) — free tier
- **BlenderKit** — free in Blender, export as GLB

## Directory → Model mapping

| Folder             | Car                          | Chassis Code |
|--------------------|------------------------------|--------------|
| `m1/`              | BMW M1                       | E26          |
| `m2-f87/`          | BMW M2 (first gen)           | F87          |
| `m2-g87/`          | BMW M2 (current gen)         | G87          |
| `m3-e30/`          | BMW M3 (1st gen)             | E30          |
| `m3-e36/`          | BMW M3 (2nd gen)             | E36          |
| `m3-e46/`          | BMW M3 (3rd gen)             | E46          |
| `m3-e90/`          | BMW M3 (4th gen, V8)         | E90/E92/E93  |
| `m3-f80/`          | BMW M3 (5th gen)             | F80          |
| `m3-g80/`          | BMW M3 (current gen)         | G80          |
| `m4-f82/`          | BMW M4 (1st gen)             | F82          |
| `m4-g82/`          | BMW M4 (current gen)         | G82          |
| `m5-e28/`          | BMW M5 (1st gen)             | E28          |
| `m5-e34/`          | BMW M5 (2nd gen)             | E34          |
| `m5-e39/`          | BMW M5 (3rd gen, V8)         | E39          |
| `m5-e60/`          | BMW M5 (4th gen, V10)        | E60          |
| `m5-f10/`          | BMW M5 (5th gen)             | F10          |
| `m5-f90/`          | BMW M5 (current gen)         | F90          |
| `m6-e63/`          | BMW M6 (1st gen)             | E63/E64      |
| `m6-f12/`          | BMW M6 (2nd gen)             | F12/F13/F06  |
| `m8-f91/`          | BMW M8                       | F91/F92/F93  |
| `x5m-e70/`         | BMW X5 M (1st gen)           | E70          |
| `x5m-f85/`         | BMW X5 M (2nd gen)           | F85          |
| `x5m-f95/`         | BMW X5 M (current gen)       | F95          |
| `x6m-e71/`         | BMW X6 M (1st gen)           | E71          |
| `x6m-f96/`         | BMW X6 M (current gen)       | F96          |
| `m-csl/`           | BMW M4 CSL                   | G82 CSL      |
| `im/`              | BMW iM (M5 PHEV)             | G90          |

## File requirements

- Format: **GLB** (binary glTF 2.0), named exactly `model.glb`
- Scale: any — the viewer auto-normalizes to fit the scene
- Materials: PBR (metallic/roughness) preferred
- Poly count: under 200k triangles recommended for web performance
- Paint meshes: name body/exterior meshes with "body", "paint", or "exterior" in the name so the paint color picker works
