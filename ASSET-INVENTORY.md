# Pinebound 0.9 — optimized original assets

The playable asset folder is approximately 316 MB, down from 746 MB (58% smaller). The build excludes 250 unused files, shares 947 unique texture images, and serves 163 model files with lossless compression. Texture dimensions and decoded pixels are preserved. Original node hierarchies, meshes, materials, animations, skins and layouts are unchanged. Original upload/source copies are preserved outside the playable folder.

Rendering now shares equivalent textures/materials and batches compatible material groups. The lab's 527 original point-light fixtures use a nearby-light budget of eight active lights, preserving local colors, intensity and reach. Light fixtures and emissive materials remain visible. The previous triangle counts are retained; this update does not simplify the original models.

44 automated checks pass, including model compression/identity responses, texture aliases, original group triangles/UVs, material colors, the light budget, multiplayer and trains. All three original scene geometry counts and all four uploaded train bogie rigs were verified after compression. Detailed file accounting is in public/assets/optimization-report.json.

Extract the download and run START-GAME.cmd with Node.js 22+. The included server transparently serves the compressed model files and texture aliases. Refresh an open browser after updating.

## Earlier version notes

# Pinebound 0.8 — connected Siren Pines update

Play at http://localhost:3000/ while the local server is running. Refresh and rejoin after updating. For the downloaded project, extract the ZIP and run START-GAME.cmd (Node.js 22+).

## Current implemented changes

- Original locally installed Siren Pines scene assets, textures and building arrangements: Pine Meadows (level 1), Pinecross (level 2), and Blackpine (level 3), joined by new country roads. The railway crosses Pinecross at the original level 2 north-side alignment (Z = -145).
- Blackpine architecture is compressed to 62% horizontal size and 80% floor spacing, while furniture retains normal scale. Eight floors are reachable using E to descend and Shift+E to ascend at the central lift.
- Cars use their uploaded materials and colors again. Ten body styles have individual dimensions; pickups are larger than sedans. Fifteen cars are drivable. All displayed speeds use MPH.
- Trains: W forward, S backward, B brake, P automatic service. Actual model bogies swivel independently on the selected rail path. Couplers remain joined through curves and switches. Passenger train has outward-facing engines at both ends; SD40 freight circulates through linked mountain tunnels.
- Source geometry is batched, distant trees use simpler models, interior furniture is culled at distance, and only the current underground lab floor renders. Server collision data comes from the imported scenes.

## Validation and limits

36 automated tests pass, covering two HTTP multiplayer clients, ownership, movement/collisions, train routes, bogies/couplings, tunnel transfers, original location data, MPH conversion and independent lab lift use. Actual train model triangle counts were checked after separating bogies. All three scene builders were also baked offline for collision data.

This is a playable prototype. Source buildings and their local arrangement are reused; connecting terrain, transport routes and multiplayer activities are new. The original horror campaign, enemies, account systems and story progression are not ported. The bus is parked and enterable. Coach interiors are not walkable, there is no AI road traffic or saved world persistence, and complex interior navigation remains approximate. Browser performance depends on hardware; no fixed frame-rate claim is made.

The server is local/LAN multiplayer. Friends need access to the same running server; localhost is only this computer.

## Previous update notes (historical; current behavior above takes precedence)

## Train controls and bogies (0.7 — current)

- **W = forward, S = backward, B = brake**, independent of the automatic timetable's current direction. Opposite throttle brakes the existing motion before reversing. W, S or B immediately take over from automatic service and release station dwell; **P** resumes automatic service. Holding both W and S gives neutral throttle. No direction-switch key is required for manual driving.
- Each car body now rides on two kingpins constrained to the selected track. Its body spans the two bogies, so its center can naturally cut inside a curve while the wheels stay over the rails. This replaces the old center-on-track / aim-at-the-next-coupler method.
- Both actual uploaded bogies swivel independently beneath each Amfleet car, Amtrak engine, SD40 and boxcar. The wheel/lower-frame geometry is separated from the rigid body without dropping triangles or changing the existing livery and textures. The reversed rear engine uses the correct swapped kingpin mapping.
- Couplers articulate between car bodies with connected drawbars and touching knuckles. Forty-metre turnout tapers ease station switching; the track and train use the same path. Cached path samples keep the additional alignment calculations out of most frame work.
- **31 automated tests pass.** They cover fixed forward/backward controls, automatic takeover, braking through zero, both routes and all station turnouts, bogie kingpin position and heading, the reversed locomotive, connected couplers, tunnels, shared passengers, signals and multiplayer HTTP clients.
- Separate source-model checks preserve every mesh triangle and verify both moving bogies on all four rail models. Original GLB files remain unchanged; rigging is applied to the game templates.

Limits: arcade vehicle behavior; no wheel suspension, wheel-contact physics or derailment simulation. Moving coach interiors remain unimplemented.

## Tunnel and double-ended train update (0.6 — prior update)

- Passenger consist: **Amtrak engine → three Amfleet coaches → reversed Amtrak engine**. Both noses face outward, matching the sketch. The leading engine orientation is corrected. **V** switches between a wide whole-train view and close chase view.
- Rails extend beyond the west and east boundaries into two mountain tunnels. When the whole consist is hidden inside, the server transfers it to the other tunnel, preserving direction, speed, driver and all passengers. It works in either direction. A busy exit holds the train safely inside until its block clears. Tunnel darkening masks the transfer; this is a portal link, not a physically simulated railway beneath the whole map.
- Freight runs continuously eastbound around this tunnel-linked route, passing Woodland, Central and Blackpine repeatedly. It does not stop for station dwell or reverse at terminals; signals may hold it for another train. SD40 and four uploaded boxcars remain. The source white edge/line primitives are removed from boxcar rendering; its red texture and wheel geometry remain.
- Roads narrowed to **8–9 m**, retaining rounded bends and joined junctions. Cars are **18% larger**, with matching larger collision bounds. There are **15 drivable cars** using ten body styles from the uploaded pack, painted only black, white, gray, blue or maroon. Body albedo is neutralized before paint tinting; glass, lights and wheels retain their separate materials.
- Bus enlarged again to **15.8 m × 3.8 m**, with a matching scaled cabin, seating collision, doorway and boarding point. It remains parked and enterable.
- **28 tests pass**, including two independent HTTP clients, opposite-facing engine ends, both tunnel directions with a rear-engine rider, occupied tunnel exits, repeated freight circuits, stopped-driver reversal, larger vehicles and allowed car colors.

### Driving through a tunnel

Board with **E**, then **P** for manual control. **W** adds power, **S** brakes, **B** stops quickly. **G** reverses direction while stopped (only the driver can do this). At a terminal, choose the outward direction to continue beyond the station into its mountain tunnel; the opposite side opens automatically. Automatic passenger service normally reverses at stations; the freight service circulates through the portals automatically. **Q** still selects the passenger airport branch at Central; the mountain portals are on the main railway.

### Remaining prototype limits

No moving walkable coach interiors, full railway signaling/interlocking, AI road traffic, drivability for the bus, or world persistence. The added cars are parked vehicles players can drive. Tunneled transfers are server-controlled and shared by multiplayer clients.

## New stock and roads (0.5 — prior update)

- Passenger service: your Untitled.glb Amtrak locomotive (21.6 m) and three amfleet.glb coaches (25.9 m), replacing the old passenger stock. Original livery remains, with subtle brushed bump detail; Amfleet end doors have window/panel textures, handles, fasteners and rubber vestibule surrounds.
- Freight service: original-color SD40 (20.44 m) plus four uploaded boxcar_untlied.glb cars (15.2 m by 3.25 m). Choose Blackpine siding to board. Both services run automatically, can be driven, and wait for single-track block reservations. Freight normally takes station sidings.
- Coupler endpoints touch to within 0.1 mm in route-wide tests. This is constrained arcade articulation; it does not simulate coupler slack, suspension or derailments.
- Roads use one polygon union for connected asphalt and rounded bends, with continuous shoulders and junction markings. Four road surface/marking draws replace hundreds of overlapping box pieces. Decorative small models cull beyond 90 m; larger ones beyond 230 m. Trees and ballast remain instanced.
- Measured fixed town view (1280×720, same camera): 1,262 → 502 draw calls (60% fewer), 1,515,227 → 1,018,095 triangles (33% fewer). FPS sampled 24–30 before and 29–58 after; this is a limited local sample, not a guaranteed frame rate.
- All 28 runtime source models loaded in the browser. Legacy Showdoze coach is retained on disk but is no longer downloaded or used by passenger service.

Controls: E board/leave stopped trains, P auto/manual, W power, S brake, B emergency brake. Q airport branch applies to passenger service only, while stopped at Central. T selects the next station siding before its approach. Bus remains parked and enterable. Moving coach interiors and full railway signaling remain planned.

# Models found in other game projects

The local Lord Verity project contains **28 GLB files**. **24 of those are now bundled**, plus the SD40 from Downloads (25 recovered models in total) with Pinebound. Its crossover README identifies the lab props and camper as reused Siren Pines uploads. This corrects the earlier, overly narrow workspace-only search.

| Model | Size | Status |
| --- | --- | --- |
| city-buildings/residential-selected.glb | 2.71 MB | Included |
| city-buildings/street-props.glb | 1.70 MB | Included |
| city-kit/roads.glb | 16.98 MB | Inventoried only |
| crossover/control-panel.glb | 0.06 MB | Included |
| crossover/core-console.glb | 0.11 MB | Included |
| crossover/electrical-panel.glb | 0.98 MB | Included |
| crossover/fluorescent-lamp.glb | 0.17 MB | Included |
| crossover/generator.glb | 0.43 MB | Included |
| crossover/nick-camper.glb | 8.44 MB | Included |
| crossover/pipes.glb | 0.87 MB | Included |
| crossover/reactor.glb | 0.46 MB | Included |
| crossover/warehouse-shelf.glb | 1.67 MB | Included |
| crossover/workbench.glb | 0.08 MB | Included |
| friends/andy.glb | 1.40 MB | Included |
| friends/darius.glb | 1.65 MB | Included |
| friends/tyler.glb | 2.41 MB | Included |
| people/head/LeePerrySmith.glb | 0.40 MB | Inventoried only |
| people/idle-source.glb | 2.16 MB | Inventoried only |
| people/nora.glb | 3.28 MB | Inventoried only |
| rail/boxcar-ttx-running-gear.glb | 2.48 MB | Included |
| rail/container-flatcar.glb | 10.01 MB | Included |
| rail/es44ac-black.glb | 5.20 MB | Included |
| rail/pinecross-track.glb | 2.68 MB | Included |
| rail/ttx-spine-clean.glb | 9.71 MB | Included |
| traffic/passenger-car-pack.glb | 11.76 MB | Included |
| vehicles/city-bus.glb | 3.87 MB | Included |
| vehicles/delta-a350.glb | 2.75 MB | Included |
| verity.glb | 8.27 MB | Included |

Also found: a complete world-v44 glTF map with four external binary buffers (not bundled), and an optimized Lord Verity binary manifest. The map is excluded to avoid replacing the prototype's server collision layout and loading another approximately 62 MB of buffers. The roads kit and unused head/animation sources are inventoried but excluded from the runtime package.

The existing Amtrak coach remains bundled separately. Embedded author, license, source URL, extensions and SHA-256 metadata are preserved in public/assets/project-inventory.json. This is a personal prototype; model metadata includes CC BY, CC BY-NC-SA and standard-license assets. No claim is made that all models have a common redistribution license. The ES44AC is unchanged and retains its CC BY-NC-SA metadata.

## Account Library check

No account Library search/list/download tool is exposed in this session. The browser's ChatGPT session opened signed out during the previous check, so Library contents have **not** been inventoried. This report is from actual local project files and returned chat attachments, not from an account Library query. Selecting Library models into this chat would make additional files accessible.


## Update 0.3

Added the owner’s detailed SD40 from Downloads (Heataker, CC BY 4.0). It retains original colors/materials and uses a 20.44 m display length; passenger coaches are 20 m. The duplicate/custom booster has been removed. The original F7 A/B files were not found; the user accepted the SD40 substitute. Existing ES44AC and freight models are parked scenery at Blackpine, not extra units in the passenger consist. The runtime now loads 24 recovered project/Downloads GLBs plus the Amtrak coach. See public/assets/project-inventory.json.


## Update 0.4

The original Siren Pines/Verity pinecross-track.glb is now included and rendered on all routes and four usable station sidings. Original geometry/UVs/materials are preserved while the longitudinal placement bends to follow the route. Distant detail is simplified beyond 200 m. The bus retains the uploaded exterior model, enlarged to 13.2 m by 3.2 m; its walkable passenger cabin is new procedural geometry. The SD40 original colors and single-engine consist remain unchanged.
