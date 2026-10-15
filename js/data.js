/* ============================================================
   GAMEROCK — data.js
   Single source of truth for games, apps, categories and site
   content. Edit this file to add new items — no HTML changes
   needed on listing pages.
   ============================================================ */

window.GAMEROCK = {

  /* ---------- SITE CONFIG ---------- */
  site: {
    name: 'GameRock',
    tagline: 'The pride rock for all games, apps and modding tools.',
    ton: 'UQAZtKzrroqz5m9LIdr1KZySRnr3Z5vVpMstlr9TlBE8q5j-',
    bank: {
      name: 'POCKETAPP',
      account: 'PIGGYVEST/AKPOTOME ALLEN OGADJE',
      number: '9696110446'
    },
    contact: {
      whatsapp: 'https://wa.me/+2349035427684',
      facebook: 'https://www.facebook.com/profile.php?id=100063468581803',
      email:    'mailto:otomee357@gmail.com'
    }
  },

  /* ---------- CATEGORIES ---------- */
  categories: {
    games: [
      { slug: 'action',     name: 'Action',     desc: 'FPS · Shooters · War',  icon: 'crosshairs' },
      { slug: 'racing',     name: 'Racing',     desc: 'Drift · Open World',    icon: 'flag-checkered' },
      { slug: 'simulation', name: 'Simulation', desc: 'Sandbox · Survival',    icon: 'cubes' }
    ],
    apps: [
      { slug: 'tools', name: 'Tools', desc: 'Modding · Utilities',  icon: 'screwdriver-wrench' },
      { slug: 'media', name: 'Media', desc: 'Music · Movies · TV',  icon: 'photo-film' }
    ]
  },

  /* ---------- GAMES ---------- */
  games: [
    {
      slug: 'nova3',
      title: 'N.O.V.A 3',
      kind: 'game',
      category: 'action',
      version: 'v1.0.8e',
      price: 'Free',
      image: 'images/nova3-image-1.jpg',
      url: 'games/action/nova3.html',
      desc: 'The most immersive sci-fi FPS franchise on mobile. Fight for humankind across 10 levels and 12-player battles.',
      tags: ['fps', 'sci-fi', 'gameloft'],
      featured: true,
      added: '2026-01-10'
    },
    {
      slug: 'nova2',
      title: 'N.O.V.A 2',
      kind: 'game',
      category: 'action',
      version: 'v1.0.5',
      price: 'Free',
      image: 'images/nova2-image-1.jpg',
      url: 'games/action/nova2.html',
      desc: '12 chapters, a dozen weapons, three special powers and an epic campaign on the colonies of Scorpius.',
      tags: ['fps', 'sci-fi', 'gameloft', 'classic'],
      featured: true,
      added: '2026-01-08'
    },
    {
      slug: 'novalegacy',
      title: 'N.O.V.A Legacy',
      kind: 'game',
      category: 'action',
      version: 'v5.8.4a',
      price: 'Free + IAP',
      image: 'images/novalegacy-image-1.jpg',
      url: 'games/action/novalegacy.html',
      desc: 'Console-like shooter on mobile with crafting, weapon upgrades and multiplayer arenas.',
      tags: ['fps', 'multiplayer', 'gameloft'],
      featured: false,
      added: '2026-01-12'
    },
    {
      slug: 'skycombat',
      title: 'Sky Combat',
      kind: 'game',
      category: 'action',
      version: 'v1.0.8e',
      price: 'Free + IAP',
      image: 'images/skycombat-image-1.jpg',
      url: 'games/action/skycombat.html',
      desc: 'Realistic aircraft combat with physics, three maps and fighters from the MiG-19 to the Su-57.',
      tags: ['war', 'pvp', 'flight'],
      featured: false,
      added: '2025-12-20'
    },
    {
      slug: 'carx',
      title: 'CarX Street',
      kind: 'game',
      category: 'racing',
      version: 'vLatest',
      price: 'Free',
      image: 'images/carx-image-1.jpg',
      url: 'games/racing/carx.html',
      desc: 'High-speed street racing with deep customization, realistic physics, day/night cycle and multiplayer.',
      tags: ['racing', 'drift', 'open-world'],
      featured: true,
      added: '2026-01-15'
    },
    {
      slug: 'minecraft',
      title: 'Minecraft',
      kind: 'game',
      category: 'simulation',
      version: 'v1.19',
      price: 'Free + IAP',
      image: 'images/mc-image-1.jpg',
      url: 'games/simulation/minecraft.html',
      desc: 'Explore, mine, craft and build without bounds. Two major modes: creative and survival.',
      tags: ['sandbox', 'survival', 'mojang'],
      featured: true,
      added: '2025-12-28'
    },
    {
      slug: 'roblox',
      title: 'Roblox',
      kind: 'game',
      category: 'simulation',
      version: 'v2.650',
      price: 'Free + IAP',
      image: 'images/roblox-image-1.jpg',
      url: 'games/simulation/roblox.html',
      desc: 'Design, build and play millions of user-created experiences. Cross-platform with friends.',
      tags: ['sandbox', 'multiplayer', 'community'],
      featured: false,
      added: '2025-12-22'
    }
  ],

  /* ---------- APPS ---------- */
  apps: [
      {
      slug: 'vphoneos',
      title: 'VPhoneOS',
      kind: 'app',
      category: 'tools',
      version: 'v5.1.8',
      price: 'Free + VIP',
      image: 'images/vphoneos.png',
      url: 'apps/game-tools/vphoneos.html',
      desc: 'Rooted Android 12 virtual machine. Run 32-bit games on 64-bit phones, install Magisk without unlocking bootloader.',
      tags: ['virtual-machine', 'root', 'magisk', '32-bit', 'sandbox'],
      featured: true,
      added: '2026-10-15'
    },
    {
      slug: 'gameguardian',
      title: 'GameGuardian',
      kind: 'app',
      category: 'tools',
      version: 'v101.1',
      price: 'Free',
      image: 'images/gg-image-1.jpg',
      url: 'apps/game-tools/gameguardian.html',
      desc: 'The best tool for hacking Android games. Memory editor with Lua scripting and speedhack.',
      tags: ['modding', 'memory-editor', 'root'],
      featured: true,
      added: '2026-01-05'
    },
    {
      slug: 'mt-manager',
      title: 'MT Manager',
      kind: 'app',
      category: 'tools',
      version: 'v2.11.0',
      price: 'Free',
      image: 'images/mt-image-1.jpg',
      url: 'apps/game-tools/mt-manager.html',
      desc: 'Access restricted files, edit APKs, dex, xml, arsc and more. Root optional.',
      tags: ['file-manager', 'apk-editor', 'modding'],
      featured: true,
      added: '2026-01-06'
    },
    {
      slug: 'f1vm',
      title: 'F1 VM',
      kind: 'app',
      category: 'tools',
      version: 'v1.1.0.6',
      price: 'Free',
      image: 'images/f1vm-image-1.jpg',
      url: 'apps/game-tools/f1vm.html',
      desc: 'Rooted Android 7 virtual machine for running root-only tools without rooting your phone.',
      tags: ['virtual-machine', 'root', 'sandbox'],
      featured: false,
      added: '2026-01-04'
    },
    {
      slug: 'il2cppdumper',
      title: 'IL2CppDumper',
      kind: 'app',
      category: 'tools',
      version: 'v6.7.8',
      price: 'Free',
      image: 'images/ll2-image-1.jpg',
      url: 'apps/game-tools/il2cppdumper.html',
      desc: 'Dump Unity IL2Cpp files for game modding, reverse engineering and analysis.',
      tags: ['reverse-engineering', 'unity', 'modding'],
      featured: false,
      added: '2026-01-07'
    },
    {
      slug: 'blackhole',
      title: 'BlackHole',
      kind: 'app',
      category: 'media',
      version: 'v35',
      price: 'Free',
      image: 'images/blackhole-image-1.jpg',
      url: 'apps/media/blackhole.html',
      desc: 'Download videos from any social platform and extract audio at top quality. Ad-free, open-source.',
      tags: ['downloader', 'video', 'audio'],
      featured: true,
      added: '2026-01-14'
    },
    {
      slug: 'fzstudios',
      title: 'FzStudioX',
      kind: 'app',
      category: 'media',
      version: 'v3.4',
      price: 'Free',
      image: 'images/fz-img-0.jpg',
      url: 'apps/media/fzstudios.html',
      desc: 'Download movies, TV series and anime from many sources. Play in any external player.',
      tags: ['movies', 'tv', 'anime'],
      featured: true,
      added: '2026-01-13'
    },
    {
      slug: 'music-downloader',
      title: 'Free Music Downloader',
      kind: 'app',
      category: 'media',
      version: 'v1.1.9',
      price: 'Free',
      image: 'images/music-d-image-1.jpg',
      url: 'apps/media/music-downloader.html',
      desc: 'Search and download any song or YouTube video. Play offline anywhere. Completely free.',
      tags: ['music', 'youtube', 'offline'],
      featured: false,
      added: '2026-01-11'
    }
  ]
};

window.GAMEROCK.all = [
  ...window.GAMEROCK.games,
  ...window.GAMEROCK.apps
];