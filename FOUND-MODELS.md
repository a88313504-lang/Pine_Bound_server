## Tunnel and double-ended train update (0.6 — current)

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
