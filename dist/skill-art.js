/* Original vector dioramas. Authored geometry, no remote assets or generated randomness. */
(function (root, factory) {
  const art = factory();
  if (typeof module === "object" && module.exports) module.exports = art;
  else root.DeckSkillArt = art;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";
  const p = (d, cls = "") => `<path${cls ? ` class="${cls}"` : ""} d="${d}"/>`;
  const r = (x, y, w, h, rx = 3, cls = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${cls ? ` class="${cls}"` : ""}/>`;
  const c = (x, y, radius, cls = "") =>
    `<circle cx="${x}" cy="${y}" r="${radius}"${cls ? ` class="${cls}"` : ""}/>`;
  const e = (x, y, rx, ry, cls = "") =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${cls ? ` class="${cls}"` : ""}/>`;
  const paper =
    p("M21 10H64L81 27V91H21Z", "scene-solid") +
    p("M64 10V27H81M33 43H69M33 54H69M33 65H57");
  const monitor =
    r(9, 15, 82, 58, 5, "scene-solid") +
    p("M9 28H91M37 88H63M50 73V88") +
    c(17, 22, 1.6, "scene-light") +
    c(24, 22, 1.6, "scene-light");
  const primitives = {
    agent:
      r(24, 26, 52, 48, 12, "scene-solid") +
      p("M50 26V14M35 74V87M65 74V87M24 45H13V65M76 45H87V65M38 60H62") +
      c(50, 10, 5, "scene-light") +
      c(38, 44, 5) +
      c(62, 44, 5),
    terminal: monitor + p("M24 40L35 50 24 60M45 60H68"),
    document: paper,
    radar:
      c(50, 51, 38, "scene-solid") +
      c(50, 51, 25) +
      c(50, 51, 11) +
      p("M50 13V89M12 51H88M50 51L77 24") +
      c(31, 64, 4, "scene-light") +
      c(68, 39, 3, "scene-light"),
    window:
      monitor +
      r(20, 38, 23, 24, 2, "scene-tint") +
      p("M52 40H79M52 49H72M52 59H79"),
    bridge: p(
      "M5 77H95M15 77V30H25V77M75 77V30H85V77M20 37Q50 76 80 37M30 49V77M42 58V77M58 58V77M70 49V77M8 84H92",
      "scene-solid",
    ),
    case:
      r(10, 28, 80, 58, 7, "scene-solid") +
      p("M33 28V16H67V28M10 47H90M18 28V86M82 28V86") +
      r(43, 42, 14, 12, 2, "scene-light"),
    device:
      r(17, 8, 66, 84, 8, "scene-solid") +
      r(25, 17, 50, 33, 3, "scene-tint") +
      p("M27 61H73M27 70H73M27 79H73M36 56V84M48 56V84M60 56V84") +
      p("M33 29L42 35 33 41M50 41H65"),
    table:
      p(
        "M8 33L66 17 94 35 35 54ZM8 33V45L35 66 94 45V35M16 49V83M35 66V94M86 49V83",
        "scene-solid",
      ) + p("M30 32L61 24 76 34 44 43Z", "scene-tint"),
    observatory:
      p(
        "M17 73V49A33 33 0 0 1 66 20L83 49V73ZM15 73H86V91H15ZM23 49H77M50 16V49",
        "scene-solid",
      ) +
      p("M51 37L76 13 86 23 61 47Z", "scene-light") +
      p("M36 84H64"),
    atlas:
      p(
        "M8 16Q30 9 50 22Q70 9 92 16V82Q69 75 50 88Q30 75 8 82ZM50 22V88",
        "scene-solid",
      ) +
      p("M17 29L28 25 36 34 26 45 38 60 24 69M62 28L80 30 75 43 64 47 76 67"),
    browser:
      monitor +
      r(15, 7, 27, 8, 2, "scene-tint") +
      p("M19 37H82M19 46H56M19 55H70") +
      c(77, 61, 8),
    lens:
      c(43, 41, 28, "scene-solid") +
      c(43, 41, 19) +
      p("M63 61L88 86 80 94 55 69Z", "scene-light") +
      p("M32 29Q43 20 54 29"),
    cloud:
      p(
        "M23 66C0 65 3 37 23 37C28 8 66 9 72 33C96 25 105 64 79 66Z",
        "scene-solid",
      ) + p("M28 79H72M39 66V79M61 66V79"),
    hand: p(
      "M25 82L14 63Q9 53 17 51L30 60V20Q30 10 39 16V46 12Q43 4 49 12V43 17Q55 9 60 18V47 28Q66 20 71 29V61Q74 83 60 92H35Z",
      "scene-solid",
    ),
    cursor: p("M22 9L81 54 55 58 72 84 58 92 42 66 26 86Z", "scene-light"),
    books:
      p(
        "M13 19H30V88H13ZM35 10H54V88H35ZM60 25L77 19 95 82 78 88Z",
        "scene-solid",
      ) + p("M18 31H25M40 23H49M40 75H49M66 36L82 31M70 51L86 46M13 88H95"),
    door:
      p("M18 93V10H81V93M29 93V21H70V93M29 21L58 30V92H29Z", "scene-solid") +
      c(50, 61, 3, "scene-light"),
    pen:
      p(
        "M24 74L66 14 82 26 40 86 19 94ZM24 74L40 86M60 23L76 35M19 94L30 90",
        "scene-solid",
      ) + p("M28 88L72 29"),
    sync:
      p(
        "M17 37A35 35 0 0 1 79 26L88 37M88 17V37H68M83 63A35 35 0 0 1 21 74L12 63M12 83V63H32",
      ) +
      r(35, 34, 30, 32, 4, "scene-solid") +
      p("M43 44H57M43 55H57"),
    archive:
      r(13, 17, 74, 71, 4, "scene-solid") +
      p("M13 39H87M13 63H87") +
      r(39, 24, 22, 8, 2) +
      r(39, 47, 22, 8, 2) +
      r(39, 71, 22, 8, 2),
    vault:
      r(9, 10, 82, 80, 8, "scene-solid") +
      r(18, 19, 64, 62, 3) +
      c(50, 50, 18) +
      c(50, 50, 5, "scene-light") +
      p("M50 32V43M50 57V68M32 50H43M57 50H68M10 30H19M10 70H19"),
    flask:
      p(
        "M36 9H64M40 9V39L16 79Q10 91 25 91H75Q90 91 84 79L60 39V9M26 65H74",
        "scene-solid",
      ) +
      c(40, 74, 5, "scene-light") +
      c(58, 57, 3) +
      c(61, 81, 4),
    prune:
      p(
        "M51 91V43M51 58L26 36M51 69L75 46M51 43Q30 30 42 13Q65 19 51 43M26 36Q9 39 9 22Q28 14 26 36M75 46Q91 47 91 27Q72 28 75 46",
        "scene-solid",
      ) + p("M33 82L65 66M35 69L65 85"),
    conveyor:
      r(4, 66, 92, 16, 8, "scene-solid") +
      c(16, 74, 4) +
      c(84, 74, 4) +
      p("M14 82V94M86 82V94") +
      r(13, 37, 20, 25, 2, "scene-tint") +
      r(43, 22, 22, 40, 2, "scene-solid") +
      r(75, 42, 18, 20, 2, "scene-light") +
      p("M20 74H77"),
    sun:
      c(50, 45, 24, "scene-tint") +
      p(
        "M50 7V14M50 77V84M12 45H19M81 45H88M23 18L28 23M73 68L78 73M23 72L28 67M73 23L78 18M9 91H91M20 84H80",
      ),
    dish:
      p(
        "M18 19Q13 67 63 80L18 19ZM36 48L72 24M63 80L52 93H79M62 72V93",
        "scene-solid",
      ) +
      p("M72 10Q93 19 93 40M70 21Q82 26 82 39") +
      c(69, 28, 4, "scene-light"),
    blueprint:
      p("M7 20L75 8 94 78 25 92Z", "scene-solid") +
      p(
        "M24 34L65 26 75 63 34 72ZM34 72L30 55 54 50 49 29M54 50L70 47M28 83L86 71",
      ),
    layout:
      r(9, 10, 82, 80, 5, "scene-solid") +
      r(17, 19, 66, 13, 2, "scene-tint") +
      r(17, 40, 20, 40, 2) +
      r(45, 40, 38, 18, 2) +
      p("M45 67H83M45 77H71"),
    schema:
      p("M22 9H72L88 25V91H22Z", "scene-solid") +
      p(
        "M72 9V25H88M38 39H31V55H26L31 59V77H38M70 39H77V55H82L77 59V77H70M47 45H61M47 58H65M47 71H59",
      ),
    pdf: paper + p("M35 78Q47 38 51 50Q54 66 70 77Q46 70 33 81", "scene-light"),
    shield:
      p("M50 7L86 22V49Q86 74 50 94Q14 74 14 49V22Z", "scene-solid") +
      p("M28 48L44 64 73 34", "scene-light"),
    chart:
      p("M12 12V87H93M22 71L40 55 55 62 78 27 90 35") +
      r(22, 75, 12, 12, 1, "scene-tint") +
      r(43, 66, 12, 21, 1, "scene-tint") +
      r(64, 48, 12, 39, 1, "scene-tint") +
      r(85, 39, 8, 48, 1, "scene-light"),
    formula:
      r(8, 15, 84, 70, 5, "scene-solid") +
      p("M39 29H23L39 49 23 70H40M54 44H77M54 56H77M62 29V36M54 33H70"),
    funnel:
      p("M8 15H92L61 55V83L39 94V55Z", "scene-solid") +
      p("M22 31H78M35 47H65M50 60V79"),
    html: monitor + p("M31 39L19 50 31 61M69 39L81 50 69 61M56 35L44 65"),
    slides:
      p(
        "M17 10H89V70H17ZM17 23H89M10 20V80H79M36 80V94M64 80V94",
        "scene-solid",
      ) + p("M28 36H70M28 46H57M28 56H77"),
    gears:
      p(
        "M39 12L59 12 62 24 74 29 85 24 95 42 86 51 86 65 95 73 85 91 73 86 61 91 59 99 39 99 35 87 24 82 13 87 3 69 12 60 12 46 3 37 13 19 25 24 36 19Z",
        "scene-solid",
      ) +
      c(49, 55, 21) +
      c(49, 55, 7, "scene-light"),
    scanner:
      p("M15 38V13H38M62 13H85V38M85 63V88H62M38 88H15V63") +
      r(28, 23, 44, 56, 3, "scene-solid") +
      p("M36 36H63M36 47H63M36 58H54M6 52H94", "scene-light"),
    scroll:
      p(
        "M19 18Q19 6 32 6H78Q92 6 92 20H79V77Q79 92 64 92H17Q6 92 6 78H64Q64 92 79 77M19 18V78M32 6Q45 6 45 20H92",
        "scene-solid",
      ) + p("M31 34H68M31 46H68M31 58H58"),
    database:
      e(50, 18, 35, 11, "scene-light") +
      p(
        "M15 18V79C15 95 85 95 85 79V18M15 38C15 54 85 54 85 38M15 58C15 74 85 74 85 58",
        "scene-solid",
      ) +
      e(50, 18, 35, 11),
    sheet:
      r(12, 9, 76, 82, 4, "scene-solid") +
      p("M12 28H88M12 47H88M12 66H88M12 81H88M30 9V91M59 28V91") +
      p("M35 36H51M65 55H80M35 74H51", "scene-light"),
    abacus:
      p("M10 13V91M90 13V91M10 26H90M10 48H90M10 70H90M4 91H96") +
      r(24, 18, 10, 16, 4, "scene-light") +
      r(39, 18, 10, 16, 4) +
      r(61, 40, 10, 16, 4, "scene-light") +
      r(25, 62, 10, 16, 4) +
      r(40, 62, 10, 16, 4, "scene-tint") +
      r(55, 62, 10, 16, 4),
    review:
      paper +
      c(68, 66, 19, "scene-solid") +
      p("M57 65L65 73 80 57M80 81L94 95", "scene-light"),
    command:
      r(7, 21, 86, 58, 5, "scene-solid") +
      p("M20 38L33 50 20 62M45 62H72M49 37H76M76 37V48M70 43L76 49 82 43"),
    compass:
      c(50, 50, 37, "scene-solid") +
      c(50, 50, 29) +
      p(
        "M50 5V14M50 86V95M5 50H14M86 50H95M63 29L57 57 29 70 43 43Z",
        "scene-tint",
      ) +
      p("M63 29L43 43 57 57Z", "scene-light"),
    needle:
      p("M77 12Q88 3 91 12L22 88 8 96 15 80ZM78 17L85 10") +
      p("M75 19C30 8 15 38 45 44S91 72 52 88", "scene-tint"),
    forge:
      p("M8 38H73L93 24V48L69 62H57V77L74 88H22L38 77V61H20Z", "scene-solid") +
      p("M31 15L57 7 70 25 44 34ZM43 30L25 54", "scene-light"),
    bug:
      e(50, 55, 23, 30, "scene-solid") +
      p(
        "M50 25V85M34 30L22 17M66 30L78 17M27 44H12V30M73 44H88V30M27 60H9M73 60H91M30 74L16 88M70 74L84 88",
      ) +
      c(41, 42, 3, "scene-light") +
      c(59, 42, 3, "scene-light"),
    palette:
      p(
        "M50 10C5 8 0 56 22 80C40 101 69 91 62 74C54 58 89 69 92 47C96 27 74 10 50 10Z",
        "scene-solid",
      ) +
      c(29, 31, 6, "scene-light") +
      c(49, 24, 6) +
      c(70, 31, 6, "scene-tint") +
      c(79, 48, 6) +
      c(25, 56, 7),
    gate:
      p(
        "M9 90V16H24V90M76 90V16H91V90M24 29H76M24 73H76M37 29V73M50 29V73M63 29V73",
        "scene-solid",
      ) +
      r(38, 41, 24, 23, 3, "scene-light") +
      p("M44 41V35A6 6 0 0 1 56 35V41"),
    dialog:
      p("M9 17H77V63H34L15 81V63H9ZM28 36H63M28 47H53", "scene-solid") +
      p("M39 73H75L89 88V73H94V36H84"),
    stencil:
      r(11, 12, 78, 77, 2, "scene-solid") +
      p("M23 25H43V45H23ZM56 25H77V45H56ZM23 59H77V77H23Z") +
      p("M6 5H22M78 5H94M6 96H22M78 96H94"),
    trigger:
      p(
        "M50 8V24M50 76V92M8 50H24M76 50H92M20 20L31 31M69 69L80 80M20 80L31 69M69 31L80 20",
      ) +
      c(50, 50, 22, "scene-solid") +
      p("M44 35L61 50 44 65Z", "scene-light"),
    component:
      p(
        "M50 7L87 28V71L50 93 13 71V28ZM13 28L50 50 87 28M50 50V93",
        "scene-solid",
      ) + p("M31 18L68 40V62L50 73 31 62V40L68 18", "scene-tint"),
    slot:
      r(9, 14, 82, 72, 5, "scene-solid") +
      p("M9 34H91M32 34V86M42 46H80V74H42Z") +
      p("M51 59H71M61 49V69", "scene-light"),
    portal:
      p(
        "M14 91V41A36 36 0 0 1 86 41V91M25 91V41A25 25 0 0 1 75 41V91M6 91H94",
        "scene-solid",
      ) + p("M35 62H65M55 51L66 62 55 73", "scene-light"),
    artboard:
      r(15, 15, 70, 70, 1, "scene-solid") +
      p("M8 8H26M8 8V26M74 8H92V26M8 74V92H26M74 92H92V74M28 35H72M28 48H57") +
      r(28, 59, 44, 13, 2, "scene-tint"),
    grid:
      r(11, 11, 78, 78, 4, "scene-solid") +
      p("M11 37H89M11 63H89M37 11V89M63 11V89") +
      r(40, 40, 20, 20, 1, "scene-light"),
    layers:
      p(
        "M8 60L50 84 92 60V73L50 97 8 73ZM8 39L50 63 92 39V52L50 76 8 52Z",
        "scene-solid",
      ) +
      p("M8 24L50 3 92 24 50 48Z", "scene-tint") +
      p("M8 24V36L50 60 92 36V24M50 48V60"),
    tree:
      p("M50 24V46M19 46H81M19 46V67M50 46V67M81 46V67") +
      r(35, 8, 30, 18, 3, "scene-light") +
      r(6, 68, 26, 21, 3, "scene-solid") +
      r(37, 68, 26, 21, 3, "scene-solid") +
      r(68, 68, 26, 21, 3, "scene-solid"),
    mold:
      p(
        "M8 25L48 8 91 28V80L51 97 8 77ZM8 25L51 44 91 28M51 44V97",
        "scene-solid",
      ) +
      p("M26 28L48 19 73 30 50 39Z", "scene-light") +
      p("M19 48L40 57V78L19 69ZM62 54L80 46V68L62 76Z"),
    foundation:
      p("M5 73L49 51 95 73 51 97ZM5 73V83L51 107 95 83V73", "scene-solid") +
      p(
        "M18 60V33L49 17 80 33V60L49 76ZM18 33L49 50 80 33M49 50V76",
        "scene-tint",
      ) +
      p("M34 25V7H63V25"),
    plugin: p(
      "M19 16H43Q33 1 49 1Q65 1 57 16H81V40Q96 30 96 47Q96 62 81 54V81H58Q67 96 50 96Q34 96 42 81H19V57Q3 66 3 49Q3 33 19 42Z",
      "scene-solid",
    ),
    swatches:
      p("M11 44L52 4 89 41 48 82ZM11 44V57L48 94 89 53V41", "scene-solid") +
      p("M24 44L52 17 76 41 48 69Z", "scene-tint") +
      p("M38 30L62 55M24 44L48 69M52 17L76 41"),
    motion:
      p("M9 73C18 73 20 27 39 27S60 73 89 20M9 88H92M9 12V88") +
      c(39, 27, 7, "scene-light") +
      p("M24 27H54M39 12V42") +
      r(70, 64, 18, 18, 3, "scene-tint"),
    metronome:
      p("M50 6L83 90H17ZM28 68H72M50 68L77 22", "scene-solid") +
      r(65, 28, 15, 10, 2, "scene-light") +
      p("M34 80H66"),
    noise:
      r(12, 11, 76, 78, 5, "scene-solid") +
      p(
        "M19 31L30 23 39 36 52 20 64 34 80 24M19 51L34 39 45 56 61 43 80 53M20 72L29 62 43 77 57 59 78 76",
      ) +
      c(29, 50, 2, "scene-light") +
      c(68, 68, 3, "scene-light") +
      c(72, 16, 2),
    prism:
      p("M47 8L87 78 30 94 8 72ZM47 8L30 94M8 72L87 78", "scene-solid") +
      p(
        "M0 39L30 43 65 38 99 27M30 43L70 49 99 49M30 43L76 61 99 72",
        "scene-light",
      ),
    spec:
      paper +
      p("M27 39H60M27 39L32 34M60 39L55 34M27 75H64M27 70V80M64 70V80") +
      r(70, 50, 24, 24, 4, "scene-light"),
    phone:
      r(24, 5, 52, 90, 9, "scene-solid") +
      p("M39 12H61M42 87H58") +
      r(30, 23, 40, 52, 2, "scene-tint") +
      p("M36 35H64M36 46H64M36 57H57"),
    mirror:
      p("M18 76V39A32 32 0 0 1 82 39V76ZM50 77V90M31 90H69", "scene-solid") +
      p("M30 28L59 57M41 20L70 49M29 49L42 62"),
    key:
      c(32, 31, 23, "scene-solid") +
      c(32, 31, 10) +
      p("M47 48L87 88 97 78 88 69 81 76 73 68 80 61 58 39", "scene-solid"),
    sticky:
      p("M14 13H86V70L65 91H14ZM65 91V70H86", "scene-solid") +
      p("M27 31H73M27 44H67M27 57H58"),
    connector:
      r(4, 8, 33, 25, 4, "scene-solid") +
      r(64, 67, 32, 25, 4, "scene-solid") +
      p(
        "M21 33V51H80V67M72 59L80 67 88 59M41 11H92M82 3L92 11 82 19",
        "scene-light",
      ),
    plan:
      p("M8 21L49 7 92 23V81L49 95 8 80ZM49 7V95", "scene-solid") +
      p(
        "M19 34L36 29M19 45L38 40M19 56L33 52M61 34L80 39M61 46L80 51M61 58L74 62",
      ) +
      c(72, 77, 6, "scene-light"),
    clock:
      c(50, 52, 36, "scene-solid") +
      p(
        "M50 52V28M50 52L68 64M50 16V23M50 81V88M14 52H21M79 52H86M40 5H60M50 5V16",
        "scene-light",
      ),
    pulse:
      p("M3 56H22L32 32 47 81 61 16 76 56H97", "scene-light") +
      p("M10 16H23M10 16V29M77 85H90V72") +
      c(76, 56, 6, "scene-solid"),
    stage:
      p("M8 17H92V71H8ZM8 27H92M50 71V91M25 91H75", "scene-solid") +
      p("M25 39L44 51 25 63Z", "scene-light") +
      p("M55 40H80M55 51H80M55 62H71"),
    notebook:
      r(18, 9, 68, 82, 4, "scene-solid") +
      p(
        "M31 9V91M10 24H25M10 42H25M10 60H25M10 78H25M41 30H73M41 43H73M41 56H63",
      ),
    signature: p(
      "M8 72Q29 21 35 42T22 78Q31 49 46 61T67 49Q77 40 72 69L93 59M8 88H92",
      "scene-light",
    ),
    tower:
      p(
        "M33 92V29L50 6 67 29V92ZM33 29H67M39 42H61M39 56H61M39 70H61M24 92H76",
        "scene-solid",
      ) + p("M17 17L33 29M83 17L67 29M50 6V1"),
    map:
      p(
        "M7 20L34 9 65 22 93 10V82L65 94 34 81 7 92ZM34 9V81M65 22V94",
        "scene-solid",
      ) +
      p("M17 72L28 48 49 58 61 36 81 37", "scene-light") +
      c(81, 37, 5),
    lighthouse:
      p(
        "M29 91L36 42H64L71 91ZM32 42V22H68V42ZM26 22L50 6 74 22M22 91H78",
        "scene-solid",
      ) +
      p(
        "M41 29H59V37H41ZM36 60H66M33 76H68M30 32L2 17V48ZM70 32L98 17V48Z",
        "scene-tint",
      ),
    branch:
      p("M25 15V84M25 63C25 40 76 66 76 30") +
      c(25, 15, 9, "scene-solid") +
      c(25, 84, 9, "scene-light") +
      c(76, 21, 9, "scene-solid") +
      c(25, 48, 7, "scene-solid"),
    hook:
      p(
        "M62 9V58Q62 87 35 87Q8 87 8 61V51L22 68M62 9H86M73 9V25H62",
        "scene-solid",
      ) + c(35, 87, 5, "scene-light"),
    chip:
      r(24, 24, 52, 52, 6, "scene-solid") +
      r(35, 35, 30, 30, 4, "scene-tint") +
      p(
        "M34 7V24M50 7V24M66 7V24M34 76V93M50 76V93M66 76V93M7 34H24M7 50H24M7 66H24M76 34H93M76 50H93M76 66H93",
      ),
    bubble:
      p("M10 15H90V70H55L34 91V70H10Z", "scene-solid") +
      c(29, 43, 5, "scene-light") +
      c(50, 43, 5, "scene-light") +
      c(71, 43, 5, "scene-light"),
    balance:
      p(
        "M50 13V88M27 88H73M16 28H84M24 28L8 59H40ZM76 28L60 59H92Z",
        "scene-solid",
      ) +
      c(50, 20, 7, "scene-light") +
      p("M8 59Q24 78 40 59M60 59Q76 78 92 59"),
    usb:
      p("M34 9H66V35H77V69L61 81H54V95H46V81L23 69V35H34Z", "scene-solid") +
      p("M34 35H66M43 18V28M57 18V28M41 48H59V64H41Z", "scene-light"),
    memory:
      p(
        "M7 23H93V75H7ZM14 75V86M26 75V86M38 75V86M50 75V86M62 75V86M74 75V86M86 75V86",
        "scene-solid",
      ) +
      r(16, 34, 26, 28, 2) +
      r(57, 34, 26, 28, 2) +
      p("M23 42H35M64 42H76"),
    megaphone:
      p(
        "M9 35H33L82 12V78L33 56H9ZM33 56L46 89H26L18 56M82 31Q101 43 82 59",
        "scene-solid",
      ) + p("M33 35V56M92 15L99 9M93 76L99 83"),
    proof:
      p(
        "M10 85L50 12 90 85ZM50 12V85M32 85A18 18 0 0 1 41 69M69 85A19 19 0 0 0 60 68",
      ) +
      r(43, 77, 8, 8, 0) +
      c(50, 12, 4, "scene-light") +
      p("M19 94H82"),
    plug:
      p(
        "M30 6V30M70 6V30M20 30H80V49Q80 70 58 72V93H42V72Q20 70 20 49Z",
        "scene-solid",
      ) + p("M34 42H66M34 52H66"),
    calendar:
      r(11, 19, 78, 72, 5, "scene-solid") +
      p(
        "M11 36H89M29 9V27M71 9V27M24 49H35M44 49H55M65 49H76M24 63H35M44 63H55M65 63H76M24 77H35M44 77H55",
      ) +
      c(71, 77, 9, "scene-light"),
    campus:
      p(
        "M7 36L50 10 93 36ZM16 39V80M33 39V80M50 39V80M67 39V80M84 39V80M10 80H90V91H10Z",
        "scene-solid",
      ) + c(50, 26, 5, "scene-light"),
    sliders:
      p("M20 12V88M50 12V88M80 12V88") +
      r(12, 24, 16, 22, 4, "scene-solid") +
      r(42, 56, 16, 22, 4, "scene-light") +
      r(72, 34, 16, 22, 4, "scene-solid"),
    scaffold:
      p(
        "M13 8V93M50 8V93M87 8V93M13 24H87M13 58H87M13 91H87M13 24L50 58 87 24M13 58L50 91 87 58",
      ) +
      r(22, 31, 19, 20, 2, "scene-tint") +
      r(59, 64, 19, 20, 2, "scene-light"),
    portfolio:
      p("M9 28V16H39L49 28H91V88H9Z", "scene-solid") +
      p("M9 40H91M25 54H75M25 66H64") +
      r(62, 69, 20, 13, 2, "scene-light"),
    embedded:
      monitor +
      r(19, 37, 32, 27, 2, "scene-tint") +
      p("M25 58V49M34 58V43M43 58V46M61 41H80M61 51H75M61 61H80"),
    star:
      r(37, 37, 26, 26, 3, "scene-light") +
      p("M50 37V17M37 50H17M63 50H83M50 63V83") +
      r(38, 3, 24, 14, 2, "scene-solid") +
      r(3, 39, 14, 22, 2, "scene-solid") +
      r(83, 39, 14, 22, 2, "scene-solid") +
      r(38, 83, 24, 14, 2, "scene-solid"),
    workflow:
      r(34, 8, 32, 20, 4, "scene-solid") +
      p("M50 28V45L71 61 50 77 29 61 50 45M29 61H11V87M71 61H89V87") +
      r(3, 87, 18, 10, 2, "scene-light") +
      r(79, 87, 18, 10, 2, "scene-solid"),
    ruler:
      p(
        "M10 67L71 6 94 29 33 90ZM22 55L33 66M35 42L44 51M48 29L59 40M61 16L70 25",
        "scene-solid",
      ) + c(29, 75, 3),
    antenna:
      p(
        "M50 34V91M28 91H72M43 61H57M38 76H62M34 10Q12 32 34 54M66 10Q88 32 66 54M26 1Q-7 32 26 63M74 1Q107 32 74 63",
      ) + c(50, 32, 8, "scene-light"),
    receipt:
      p("M20 7H80V94L70 86 60 94 50 86 40 94 30 86 20 94Z", "scene-solid") +
      p("M31 24H69M31 35H69M31 46H55M31 64H69M31 74H49"),
    tenants:
      p("M10 19L50 7 90 19V89H10ZM50 7V89M10 42H90M10 66H90", "scene-solid") +
      p(
        "M23 29H36M64 29H77M23 53H36M64 53H77M23 77H36M64 77H77",
        "scene-light",
      ),
    wall: p(
      "M8 22H92V88H8ZM8 44H92M8 66H92M29 22V44M65 22V44M47 44V66M29 66V88M65 66V88",
      "scene-solid",
    ),
    flashlight:
      p(
        "M12 75L54 33 67 46 25 88ZM54 33L60 13 87 40 67 46ZM60 13L94 0 100 29 87 40",
        "scene-solid",
      ) + p("M23 72L37 59M43 48L53 58", "scene-light"),
    rocket:
      p(
        "M49 5Q78 28 70 63L50 83 30 63Q22 28 49 5ZM30 49L10 69V88L34 73M70 49L90 69V88L66 73M42 83L50 99 58 83",
        "scene-solid",
      ) + c(50, 34, 11, "scene-tint"),
    fort:
      p(
        "M9 20H24V34H38V20H53V34H67V20H82V34H93V91H9ZM39 91V67A12 12 0 0 1 63 67V91",
        "scene-solid",
      ) + p("M21 49H28V60H21ZM73 49H80V60H73Z"),
    quill: p(
      "M14 91L38 63Q38 15 91 7Q91 63 39 65M38 63L77 22M49 49V30M61 39L80 39M24 91H69",
      "scene-solid",
    ),
    store:
      p(
        "M12 35H88V91H12ZM7 35L19 9H81L93 35Q86 50 72 35Q58 50 44 35Q30 50 16 35Q10 47 7 35Z",
        "scene-solid",
      ) +
      p("M26 9L20 35M43 9L42 35M60 9L64 35M76 9L84 35") +
      r(24, 57, 23, 34, 1) +
      r(58, 57, 20, 19, 1, "scene-tint"),
    telegram: p(
      "M5 42L95 8 73 91 46 69 28 83 30 57ZM30 57L79 24 46 69M28 83L46 69",
      "scene-solid",
    ),
    signal:
      p(
        "M9 90V72H24V90ZM32 90V51H47V90ZM55 90V30H70V90ZM78 90V9H93V90Z",
        "scene-tint",
      ) + p("M9 58L29 38 44 42 77 9M61 9H77V25", "scene-light"),
    traffic:
      r(31, 7, 38, 77, 12, "scene-solid") +
      c(50, 24, 8) +
      c(50, 45, 8, "scene-light") +
      c(50, 66, 8) +
      p(
        "M50 84V96M34 96H66M23 15H31M23 36H31M23 57H31M69 15H77M69 36H77M69 57H77",
      ),
    film:
      r(6, 19, 88, 64, 3, "scene-solid") +
      p(
        "M6 31H94M6 71H94M18 19V31M34 19V31M50 19V31M66 19V31M82 19V31M18 71V83M34 71V83M50 71V83M66 71V83M82 71V83M41 40L62 52 41 63Z",
        "scene-light",
      ),
    clapper:
      p("M9 39H91V91H9ZM9 23L86 5 91 23 14 42Z", "scene-solid") +
      p("M20 20L33 38M40 16L53 32M60 11L73 27M24 55H76M24 68H61"),
    regex:
      r(6, 20, 88, 63, 5, "scene-solid") +
      p("M34 33H22V69H34M66 33H78V69H66M50 35V58M39 41L61 53M39 53L61 41") +
      c(50, 69, 2, "scene-light"),
  };
  // Each row is a distinct composition: id, scene title, setting, then placed objects.
  // Object tuples: [primitive, x, y, scale, rotation, motion]. Coordinates use a 320×260 stage.
  const scenes = [
    [
      "agent-development",
      "Agente tomando forma na forja",
      "desk",
      ["forge", 40, 111, 0.82],
      ["agent", 142, 57, 1.1, 0, "breathe"],
      ["blueprint", 232, 122, 0.55],
    ],
    [
      "ambiente-dev-windows",
      "Terminal orientado pela bússola de ambiente",
      "podium",
      ["terminal", 86, 91, 1.32],
      ["compass", 207, 48, 0.7, 0, "turn"],
      ["device", 36, 137, 0.59],
    ],
    [
      "automacao-documentos-office",
      "Documentos saindo de uma oficina comum",
      "rails",
      ["conveyor", 58, 105, 1.65],
      ["document", 66, 59, 0.61, -9],
      ["sheet", 145, 50, 0.7, 0, "lift"],
      ["slides", 225, 83, 0.55],
    ],
    [
      "brief",
      "Radar jurídico acima das pendências",
      "desk",
      ["radar", 126, 40, 1.18, 0, "turn"],
      ["calendar", 37, 121, 0.67],
      ["balance", 229, 117, 0.6],
      ["document", 106, 157, 0.43],
    ],
    [
      "build-mcp-app",
      "Interface interativa aberta dentro da conversa",
      "room",
      ["window", 104, 68, 1.43],
      ["dialog", 31, 113, 0.75],
      ["cursor", 236, 149, 0.45, -13, "lift"],
    ],
    [
      "build-mcp-server",
      "Ponte entre ferramentas e um servidor",
      "bridge",
      ["bridge", 87, 104, 1.43],
      ["database", 30, 77, 0.68],
      ["plug", 230, 65, 0.71, 0, "breathe"],
      ["terminal", 128, 41, 0.62],
    ],
    [
      "build-mcpb",
      "Conector local preparado para viajar",
      "podium",
      ["case", 95, 91, 1.3],
      ["plug", 127, 54, 0.63, 0, "lift"],
      ["schema", 33, 137, 0.58],
      ["usb", 239, 131, 0.45],
    ],
    [
      "cardputer-buddy",
      "Aplicativo de bolso ligado à bancada serial",
      "desk",
      ["device", 110, 56, 1.37],
      ["terminal", 30, 126, 0.7],
      ["usb", 232, 128, 0.64, -13, "breathe"],
    ],
    [
      "claude-acta-drivedata",
      "Mesa com decisões e calendário ainda aberto",
      "desk",
      ["table", 60, 116, 1.73],
      ["document", 119, 49, 0.9],
      ["dialog", 28, 67, 0.63, 0, "lift"],
      ["calendar", 226, 85, 0.63],
    ],
    [
      "claude-automation-recommender",
      "Observatório buscando rotinas repetidas",
      "field",
      ["observatory", 95, 62, 1.47],
      ["branch", 29, 123, 0.68],
      ["gears", 231, 126, 0.59, 0, "turn"],
    ],
    [
      "claude-bi-documentation",
      "Atlas aberto sobre o modelo semântico",
      "desk",
      ["atlas", 65, 96, 1.5],
      ["star", 203, 53, 0.83],
      ["pen", 234, 147, 0.5, -10, "trace"],
      ["database", 29, 61, 0.61],
    ],
    [
      "claude-built-in-browser",
      "Cabine de navegação com contexto de sessão",
      "room",
      ["browser", 81, 64, 1.63],
      ["compass", 31, 143, 0.54],
      ["cursor", 236, 139, 0.57, 0, "lift"],
    ],
    [
      "claude-chrome-browser",
      "Lupa atravessando uma pilha de abas",
      "desk",
      ["browser", 59, 72, 1.28],
      ["window", 108, 92, 1.28],
      ["lens", 198, 109, 0.79, 0, "trace"],
    ],
    [
      "claude-cloud-code-architecture",
      "Fronteiras entre nuvem e serviços",
      "field",
      ["cloud", 104, 32, 1.22],
      ["tree", 92, 105, 1.43],
      ["wall", 28, 139, 0.51],
      ["shield", 239, 139, 0.53, 0, "breathe"],
    ],
    [
      "claude-computer-use",
      "Mão guiando uma janela observada",
      "room",
      ["window", 51, 57, 1.49],
      ["hand", 196, 91, 1.08, 0, "lift"],
      ["lens", 29, 155, 0.5],
    ],
    [
      "claude-computer-use-staging",
      "Ensaio do cursor antes da primeira ação",
      "desk",
      ["stencil", 79, 62, 1.33],
      ["cursor", 188, 112, 0.9, 0, "lift"],
      ["clock", 35, 145, 0.54],
      ["shield", 243, 51, 0.44],
    ],
    [
      "claude-deep-research",
      "Evidências reunidas na mesa de investigação",
      "desk",
      ["books", 28, 91, 0.87],
      ["map", 123, 82, 1.16],
      ["lens", 222, 103, 0.75, 0, "trace"],
      ["document", 95, 148, 0.55, -12],
    ],
    [
      "claude-docs",
      "Porta de acesso a documentos compartilhados",
      "room",
      ["door", 110, 45, 1.5],
      ["document", 40, 111, 0.77],
      ["plug", 230, 126, 0.59, 0, "breathe"],
    ],
    [
      "claude-docx",
      "Livro revisado com marcas e caneta",
      "podium",
      ["atlas", 76, 84, 1.45],
      ["pen", 222, 68, 0.81, 8, "trace"],
      ["review", 31, 142, 0.56],
    ],
    [
      "claude-google-workspace",
      "Ponte de revisões entre documentos vivos",
      "bridge",
      ["document", 35, 70, 0.85],
      ["sync", 126, 56, 0.87, 0, "turn"],
      ["spec", 221, 86, 0.8],
      ["bridge", 91, 153, 1.23],
    ],
    [
      "claude-import-memory",
      "Arquivo que recebe contexto sem sobrescrever",
      "shelves",
      ["archive", 172, 91, 1.02],
      ["notebook", 36, 67, 1.03],
      ["sync", 125, 154, 0.49, 0, "trace"],
      ["key", 240, 40, 0.45],
    ],
    [
      "claude-maia",
      "Arquivo interno fechado por uma chave",
      "room",
      ["vault", 102, 79, 1.38],
      ["key", 34, 146, 0.75, -19],
      ["archive", 237, 71, 0.55],
      ["shield", 132, 40, 0.5, 0, "breathe"],
    ],
    [
      "claude-marketplace-skill-creator",
      "Instruções em bancada comparativa de ensaio",
      "desk",
      ["flask", 115, 61, 1.13, 0, "breathe"],
      ["document", 32, 110, 0.75, -8],
      ["review", 224, 105, 0.75],
      ["sliders", 95, 151, 0.43],
    ],
    [
      "claude-md-improver",
      "Contexto podado sobre um caderno de projeto",
      "field",
      ["notebook", 61, 100, 1.14],
      ["prune", 169, 43, 1.25, 0, "lift"],
      ["terminal", 233, 153, 0.53],
    ],
    [
      "claude-messi-knowledge-ingest",
      "PDFs classificados na esteira de conhecimento",
      "rails",
      ["conveyor", 63, 117, 1.92],
      ["pdf", 27, 67, 0.69],
      ["funnel", 123, 44, 0.8],
      ["database", 229, 78, 0.78, 0, "breathe"],
    ],
    [
      "claude-morning",
      "Mapa de agenda iluminado pela manhã",
      "desk",
      ["sun", 187, 32, 0.96, 0, "breathe"],
      ["map", 36, 104, 1.1],
      ["calendar", 141, 100, 1.05],
      ["dialog", 245, 149, 0.45],
    ],
    [
      "claude-oraculo",
      "Observatório de carteira sobre bases conciliadas",
      "field",
      ["dish", 108, 35, 1.22, 0, "turn"],
      ["database", 35, 126, 0.77],
      ["chart", 194, 116, 0.99],
      ["balance", 122, 164, 0.46],
    ],
    [
      "claude-pbip",
      "Planta de um relatório e seu modelo",
      "desk",
      ["blueprint", 90, 65, 1.54],
      ["database", 24, 124, 0.68],
      ["layout", 238, 123, 0.57],
    ],
    [
      "claude-pbir-expert",
      "Páginas montadas sobre vínculos semânticos",
      "shelves",
      ["layout", 101, 78, 1.22],
      ["layers", 24, 123, 0.8],
      ["connector", 228, 101, 0.72, 0, "trace"],
      ["star", 131, 35, 0.47],
    ],
    [
      "claude-pbir-format",
      "Molde de esquema preservando a página",
      "podium",
      ["schema", 110, 49, 1.4],
      ["ruler", 29, 108, 0.83, 12],
      ["layout", 224, 137, 0.64],
    ],
    [
      "claude-pdf",
      "Lente separando tabela digital e página escaneada",
      "desk",
      ["pdf", 65, 64, 1.36],
      ["lens", 174, 87, 1.03, 0, "trace"],
      ["sheet", 242, 153, 0.48, -8],
    ],
    [
      "claude-power-bi-best-practices",
      "Inspeção do modelo com severidades distintas",
      "wall",
      ["star", 91, 77, 1.28],
      ["shield", 220, 109, 0.79],
      ["lens", 32, 123, 0.7, 0, "trace"],
    ],
    [
      "claude-power-bi-data-analysis",
      "Indicadores diante de uma pergunta de negócio",
      "desk",
      ["chart", 98, 74, 1.36],
      ["dialog", 24, 53, 0.81],
      ["compass", 227, 134, 0.63, 0, "turn"],
    ],
    [
      "claude-power-bi-dax-optimization",
      "Medidas comparadas na bancada DAX",
      "desk",
      ["formula", 98, 60, 1.25],
      ["abacus", 26, 122, 0.79],
      ["balance", 220, 116, 0.85, 0, "breathe"],
    ],
    [
      "claude-power-query-best-practices",
      "Filtros e tipos em um fluxo de transformação",
      "rails",
      ["database", 27, 93, 0.83],
      ["funnel", 121, 61, 1.08],
      ["sheet", 232, 107, 0.73],
      ["gears", 184, 156, 0.42, 0, "turn"],
    ],
    [
      "claude-powerbi-html-visuals",
      "Visual HTML conectado ao indicador",
      "podium",
      ["html", 63, 67, 1.55],
      ["chart", 203, 112, 0.89, 0, "trace"],
      ["formula", 30, 153, 0.5],
    ],
    [
      "claude-pptx",
      "Ideias em um palco com slides editáveis",
      "room",
      ["stage", 90, 54, 1.46],
      ["slides", 25, 132, 0.72],
      ["pen", 233, 125, 0.66, -13],
    ],
    [
      "claude-protheus-expert",
      "Engrenagens do ERP ligadas ao dicionário",
      "desk",
      ["gears", 99, 60, 1.19, 0, "turn"],
      ["database", 27, 120, 0.73],
      ["schema", 228, 108, 0.79],
      ["branch", 124, 161, 0.41],
    ],
    [
      "claude-security",
      "Sala de varredura e verificação de alertas",
      "room",
      ["scanner", 100, 61, 1.3, 0, "trace"],
      ["shield", 35, 129, 0.7],
      ["terminal", 222, 116, 0.77],
    ],
    [
      "claude-skill-creator",
      "Instrução escrita, ensaiada e revista",
      "desk",
      ["scroll", 86, 56, 1.26],
      ["flask", 221, 104, 0.76, 0, "breathe"],
      ["pen", 31, 124, 0.69, -14],
    ],
    [
      "claude-tmdl",
      "Texto do modelo ligado às identidades",
      "shelves",
      ["schema", 92, 55, 1.35],
      ["database", 220, 116, 0.85],
      ["quill", 25, 120, 0.76, 0, "trace"],
    ],
    [
      "claude-xlsx",
      "Células calculadas com referências visíveis",
      "desk",
      ["sheet", 81, 47, 1.47],
      ["abacus", 222, 120, 0.76, 0, "trace"],
      ["formula", 25, 151, 0.54],
    ],
    [
      "claude-xlsx-staging",
      "Planilha ensaiada em dois motores",
      "bridge",
      ["sheet", 107, 49, 1.2],
      ["terminal", 22, 130, 0.79],
      ["window", 225, 130, 0.73],
      ["sync", 135, 169, 0.42, 0, "turn"],
    ],
    [
      "code-review-and-quality",
      "Código diante de uma contraprova",
      "desk",
      ["review", 111, 60, 1.26],
      ["terminal", 24, 113, 0.91],
      ["bug", 236, 137, 0.55, 0, "trace"],
    ],
    [
      "command-development",
      "Painel de comando com argumento definido",
      "room",
      ["command", 77, 61, 1.64],
      ["sliders", 231, 118, 0.63],
      ["schema", 32, 142, 0.56],
    ],
    [
      "compliance-check",
      "Bússola jurídica antes de atravessar a fronteira",
      "field",
      ["compass", 99, 57, 1.3, 0, "turn"],
      ["balance", 31, 124, 0.76],
      ["gate", 225, 118, 0.78],
    ],
    [
      "cowork-plugin-customizer",
      "Plugin ajustado na mesa do alfaiate",
      "desk",
      ["plugin", 107, 69, 1.18],
      ["needle", 218, 94, 0.81, 0, "trace"],
      ["ruler", 24, 130, 0.76, 10],
    ],
    [
      "create-cowork-plugin",
      "Assistente montado de componentes delimitados",
      "podium",
      ["forge", 24, 127, 0.9],
      ["plugin", 121, 43, 1.17, 0, "lift"],
      ["agent", 223, 124, 0.7],
      ["blueprint", 75, 64, 0.5],
    ],
    [
      "debugging-and-error-recovery",
      "Detetive seguindo o rastro de uma falha",
      "path",
      ["bug", 110, 99, 1.03],
      ["lens", 187, 39, 1.06, 0, "trace"],
      ["receipt", 29, 129, 0.65],
      ["branch", 244, 155, 0.43],
    ],
    [
      "design-de-interface-autoral",
      "Ateliê de interface, paleta e proporção",
      "desk",
      ["artboard", 89, 62, 1.28],
      ["palette", 26, 122, 0.77],
      ["ruler", 218, 105, 0.85, 11],
      ["cursor", 227, 45, 0.43, 0, "lift"],
    ],
    [
      "discord-access",
      "Portaria do canal com autorização delimitada",
      "wall",
      ["gate", 112, 62, 1.4],
      ["bubble", 28, 117, 0.72],
      ["key", 230, 139, 0.59, -14],
    ],
    [
      "discord-configure",
      "Bot ligado à sua estação de configuração",
      "room",
      ["agent", 105, 65, 1.24, 0, "breathe"],
      ["sliders", 32, 122, 0.75],
      ["antenna", 226, 102, 0.79],
    ],
    [
      "estilo-de-colaboracao",
      "Bússola da comunicação sobre uma mesa comum",
      "desk",
      ["compass", 117, 70, 1.02],
      ["dialog", 29, 96, 0.91],
      ["notebook", 224, 103, 0.77],
      ["hand", 125, 161, 0.43, 0, "lift"],
    ],
    [
      "example-command",
      "Molde didático para o primeiro argumento",
      "podium",
      ["stencil", 101, 51, 1.44],
      ["command", 31, 141, 0.7],
      ["cursor", 232, 142, 0.57],
    ],
    [
      "example-skill",
      "Caderno que distingue gatilho e contexto",
      "desk",
      ["notebook", 92, 62, 1.31],
      ["trigger", 215, 107, 0.86, 0, "breathe"],
      ["document", 28, 142, 0.52],
    ],
    [
      "figma-code-connect",
      "Ponte de um componente para seu código",
      "bridge",
      ["component", 29, 78, 0.95],
      ["html", 207, 88, 0.96],
      ["bridge", 102, 147, 1.13],
      ["connector", 127, 44, 0.64, 0, "trace"],
    ],
    [
      "figma-code-connect-figquery",
      "Slots aninhados atravessam a ponte FigQuery",
      "bridge",
      ["slot", 102, 52, 1.28],
      ["component", 24, 130, 0.75],
      ["schema", 224, 122, 0.79],
      ["plug", 148, 162, 0.42, 0, "breathe"],
    ],
    [
      "figma-code-workflows",
      "Protótipo atravessando um portal editável",
      "room",
      ["portal", 104, 37, 1.57],
      ["html", 23, 119, 0.89],
      ["layers", 228, 119, 0.77, 0, "lift"],
    ],
    [
      "figma-create-new-file",
      "Primeira prancheta em um espaço preparado",
      "podium",
      ["artboard", 90, 48, 1.55],
      ["pen", 34, 133, 0.69, -12],
      ["key", 238, 117, 0.57],
    ],
    [
      "figma-create-new-file-figquery",
      "Grid de slides preparado antes do conteúdo",
      "room",
      ["grid", 104, 52, 1.3],
      ["slides", 25, 139, 0.76],
      ["plug", 238, 128, 0.54, 0, "breathe"],
    ],
    [
      "figma-design-to-code",
      "Tela traduzida em uma implementação navegável",
      "desk",
      ["layout", 24, 72, 1.05],
      ["html", 182, 83, 1.13],
      ["connector", 119, 135, 0.71, 0, "trace"],
    ],
    [
      "figma-design-to-code-figquery",
      "Lente detalha os nós por trás da moldura",
      "room",
      ["artboard", 61, 58, 1.35],
      ["lens", 182, 82, 1.09, 0, "trace"],
      ["layers", 228, 160, 0.49],
    ],
    [
      "figma-generate-design",
      "Cena editável montada com partes reais",
      "desk",
      ["layout", 103, 54, 1.4],
      ["component", 26, 127, 0.8],
      ["palette", 234, 132, 0.61],
      ["layers", 183, 165, 0.39, 0, "lift"],
    ],
    [
      "figma-generate-design-figquery",
      "Três seções montadas na prancheta FigQuery",
      "shelves",
      ["artboard", 26, 70, 0.89],
      ["slot", 126, 91, 0.93],
      ["window", 221, 112, 0.76],
      ["cursor", 189, 44, 0.49, 0, "lift"],
    ],
    [
      "figma-generate-diagram",
      "Caminhos de decisão desenhados no mapa",
      "path",
      ["workflow", 105, 43, 1.38],
      ["map", 27, 137, 0.71],
      ["pen", 232, 115, 0.7, 0, "trace"],
    ],
    [
      "figma-generate-diagram-figquery",
      "Entidades ligadas em uma estrutura de relações",
      "room",
      ["tree", 86, 52, 1.48],
      ["books", 28, 137, 0.66],
      ["database", 235, 132, 0.62],
      ["connector", 130, 164, 0.45, 0, "trace"],
    ],
    [
      "figma-generate-library",
      "Componentes saindo de um molde comum",
      "desk",
      ["mold", 105, 74, 1.18],
      ["component", 28, 115, 0.81],
      ["component", 230, 123, 0.63],
      ["swatches", 125, 31, 0.53, 0, "lift"],
    ],
    [
      "figma-generate-library-figquery",
      "Biblioteca sobre fundações com identidade",
      "podium",
      ["foundation", 101, 72, 1.31],
      ["books", 26, 112, 0.83],
      ["grid", 233, 113, 0.68],
      ["key", 184, 38, 0.46],
    ],
    [
      "figma-generative-plugins",
      "Extensão com botão e retorno na oficina",
      "desk",
      ["plugin", 103, 56, 1.27],
      ["window", 23, 126, 0.8],
      ["trigger", 229, 128, 0.61, 0, "breathe"],
    ],
    [
      "figma-generative-plugins-figquery",
      "Paleta local ganhando controles na extensão",
      "desk",
      ["swatches", 93, 49, 1.26],
      ["plugin", 227, 115, 0.75],
      ["sliders", 28, 127, 0.69, 0, "trace"],
    ],
    [
      "figma-implement-motion",
      "Curva de movimento encontra o código",
      "path",
      ["motion", 89, 53, 1.38, 0, "trace"],
      ["html", 219, 129, 0.76],
      ["component", 28, 139, 0.64],
    ],
    [
      "figma-implement-motion-figquery",
      "Três sinais coordenados por um metrônomo",
      "rails",
      ["metronome", 115, 45, 1.36, 0, "turn"],
      ["pulse", 22, 130, 0.75],
      ["clock", 231, 131, 0.64],
      ["component", 77, 78, 0.39],
    ],
    [
      "figma-shaders",
      "Textura procedural misturada na bancada",
      "desk",
      ["noise", 99, 55, 1.35],
      ["flask", 25, 122, 0.8, 0, "breathe"],
      ["sliders", 236, 117, 0.64],
    ],
    [
      "figma-shaders-figquery",
      "Prisma transforma a camada em pixels",
      "field",
      ["prism", 98, 51, 1.4, 0, "breathe"],
      ["grid", 26, 132, 0.75],
      ["layers", 235, 130, 0.66],
    ],
    [
      "figma-spec",
      "Decisão editada sem perder os comentários",
      "desk",
      ["spec", 103, 47, 1.42],
      ["dialog", 27, 131, 0.76],
      ["pen", 239, 103, 0.65, 0, "trace"],
    ],
    [
      "figma-swiftui",
      "Ponte entre tela nativa e sistema visual",
      "bridge",
      ["phone", 40, 70, 1.1],
      ["artboard", 206, 89, 1.04],
      ["bridge", 114, 152, 1.01],
      ["swatches", 127, 49, 0.59],
    ],
    [
      "figma-swiftui-figquery",
      "Vista nativa refletida em camadas editáveis",
      "desk",
      ["mirror", 102, 40, 1.46],
      ["phone", 27, 117, 0.83],
      ["layers", 231, 129, 0.7, 0, "lift"],
    ],
    [
      "figma-use",
      "Chave de operação diante do canvas",
      "room",
      ["artboard", 65, 53, 1.45],
      ["key", 194, 102, 1.01, -12],
      ["schema", 28, 161, 0.48],
    ],
    [
      "figma-use-figjam",
      "Mesa com três notas para uma conversa",
      "desk",
      ["table", 58, 120, 1.81],
      ["sticky", 40, 57, 0.68, -9],
      ["sticky", 131, 45, 0.79, 3, "lift"],
      ["sticky", 231, 67, 0.63, 9],
    ],
    [
      "figma-use-figjam-figquery",
      "Notas ligadas por duas rotas distintas",
      "path",
      ["sticky", 25, 110, 0.76],
      ["connector", 113, 61, 1.2, 0, "trace"],
      ["bubble", 226, 45, 0.65],
      ["document", 234, 138, 0.62],
    ],
    [
      "figma-use-figquery",
      "Plano de construção antes de materializar nós",
      "desk",
      ["plan", 103, 57, 1.34],
      ["scaffold", 26, 124, 0.76],
      ["component", 231, 128, 0.66, 0, "lift"],
    ],
    [
      "figma-use-motion",
      "Relojoeiro ajustando camadas ao tempo",
      "orbit",
      ["clock", 111, 57, 1.15, 0, "turn"],
      ["layers", 28, 126, 0.78],
      ["motion", 221, 126, 0.72],
    ],
    [
      "figma-use-motion-figquery",
      "Pulso de escala numa timeline delimitada",
      "rails",
      ["pulse", 75, 74, 1.59, 0, "trace"],
      ["component", 28, 135, 0.63],
      ["clock", 239, 134, 0.6],
    ],
    [
      "figma-use-slides",
      "Narrativa distribuída em cenas de palco",
      "room",
      ["stage", 106, 42, 1.29],
      ["slides", 26, 137, 0.78],
      ["palette", 231, 133, 0.64],
    ],
    [
      "figma-use-slides-figquery",
      "Notas discretas ao lado da apresentação",
      "desk",
      ["stage", 30, 66, 1.14],
      ["notebook", 177, 76, 1.19],
      ["pen", 134, 142, 0.64, 16, "trace"],
    ],
    [
      "frontend-design",
      "Assinatura desenhada entre matéria e tipografia",
      "desk",
      ["palette", 34, 68, 1.02],
      ["artboard", 160, 44, 1.14],
      ["signature", 98, 145, 1.23, 0, "trace"],
    ],
    [
      "fullstack-nextjs-vercel",
      "Torre publicando uma rota verificada",
      "field",
      ["tower", 108, 41, 1.56],
      ["cloud", 220, 53, 0.69],
      ["terminal", 23, 139, 0.81],
    ],
    [
      "generate-project-plan",
      "Atlas aberto com dependências do projeto",
      "desk",
      ["map", 97, 49, 1.39],
      ["workflow", 225, 118, 0.7],
      ["notebook", 25, 124, 0.76],
      ["compass", 132, 164, 0.41],
    ],
    [
      "gestao-de-entregas-e-homologacao",
      "Farol separa entrega e validação",
      "field",
      ["lighthouse", 109, 39, 1.55, 0, "breathe"],
      ["review", 28, 128, 0.78],
      ["calendar", 231, 124, 0.73],
    ],
    [
      "git-workflow-and-versioning",
      "Histórico ramificado protegido por fronteiras",
      "path",
      ["branch", 97, 44, 1.53, 0, "trace"],
      ["shield", 228, 115, 0.77],
      ["receipt", 27, 133, 0.72],
    ],
    [
      "hook-development",
      "Evento interceptado antes de chegar ao arquivo",
      "rails",
      ["hook", 119, 48, 1.25],
      ["trigger", 29, 118, 0.85, 0, "breathe"],
      ["document", 234, 121, 0.7],
    ],
    [
      "ia-aplicada-a-produtos",
      "Inteligência apoiada em catálogo e validação",
      "desk",
      ["chip", 114, 58, 1.18, 0, "breathe"],
      ["books", 28, 116, 0.83],
      ["shield", 226, 126, 0.73],
      ["connector", 139, 162, 0.43],
    ],
    [
      "imessage-access",
      "Portaria da conversa e lista permitida",
      "wall",
      ["door", 109, 44, 1.5],
      ["bubble", 26, 125, 0.84],
      ["review", 230, 131, 0.67],
    ],
    [
      "imessage-configure",
      "Conversa ligada a dispositivo e sinal",
      "room",
      ["phone", 111, 46, 1.44],
      ["bubble", 28, 115, 0.75],
      ["signal", 228, 113, 0.76, 0, "trace"],
    ],
    [
      "integracoes-erp-fiscal-financeiro",
      "Ponte de conciliação entre registros financeiros",
      "bridge",
      ["database", 25, 85, 0.96],
      ["receipt", 224, 72, 0.95],
      ["balance", 118, 79, 0.88],
      ["bridge", 106, 159, 1.05],
    ],
    [
      "legal-response",
      "Resposta jurídica preparada sobre um modelo",
      "desk",
      ["scroll", 97, 48, 1.44],
      ["dialog", 26, 132, 0.79],
      ["balance", 232, 128, 0.69],
    ],
    [
      "legal-risk-assessment",
      "Exposição jurídica em duas dimensões",
      "podium",
      ["grid", 106, 58, 1.21],
      ["balance", 24, 115, 0.89],
      ["compass", 227, 109, 0.79, 0, "turn"],
    ],
    [
      "m5-onboard",
      "Dispositivo recebe seu primeiro pulso USB",
      "desk",
      ["device", 100, 45, 1.43],
      ["usb", 29, 129, 0.76, 18],
      ["pulse", 228, 130, 0.72, 0, "trace"],
    ],
    [
      "magnitude",
      "Modelo local dimensionado para o hardware",
      "room",
      ["chip", 104, 65, 1.29],
      ["memory", 25, 126, 0.78],
      ["database", 235, 116, 0.67],
      ["sliders", 132, 27, 0.44],
    ],
    [
      "orquestrador-de-modelos",
      "Regência de modelos por complexidade da tarefa",
      "room",
      ["metronome", 106, 58, 1.31],
      ["sliders", 27, 127, 0.79],
      ["chip", 233, 121, 0.68],
    ],
    [
      "agent-builder",
      "Oficina que decide antes de construir o agente",
      "room",
      ["agent", 104, 58, 1.3],
      ["blueprint", 26, 126, 0.8],
      ["gears", 232, 124, 0.68],
    ],
    [
      "human-authentic-writing-audit",
      "Pena que devolve a voz de quem assina",
      "desk",
      ["quill", 108, 60, 1.28],
      ["mirror", 28, 128, 0.78],
      ["lens", 231, 122, 0.69],
    ],
    [
      "markdown-builder",
      "Caderno que obedece a um único padrão",
      "desk",
      ["notebook", 105, 58, 1.3],
      ["stencil", 27, 127, 0.8],
      ["ruler", 233, 123, 0.67],
    ],
    [
      "master-prompt-generator",
      "Pergaminho escrito para o modelo que vai ler",
      "room",
      ["scroll", 106, 56, 1.32],
      ["pen", 26, 128, 0.78],
      ["regex", 232, 121, 0.7],
    ],
    [
      "skill-builder",
      "Molde que faz a skill responder sempre igual",
      "room",
      ["forge", 103, 57, 1.31],
      ["mold", 27, 126, 0.79],
      ["review", 233, 122, 0.68],
    ],
    [
      "arquitetura-de-contexto-e-rag",
      "Atlas que leva a pergunta ao trecho certo",
      "bridge",
      ["atlas", 106, 59, 1.29],
      ["books", 26, 127, 0.8],
      ["funnel", 232, 124, 0.67],
    ],
    [
      "revisao-de-agentes-para-producao",
      "Radar que procura o erro antes da produção",
      "bridge",
      ["radar", 105, 58, 1.3],
      ["shield", 27, 128, 0.78],
      ["flashlight", 233, 120, 0.7],
    ],
    [
      "prontidao-de-sistemas-de-ia",
      "Observatório que libera ou segura o lançamento",
      "podium",
      ["observatory", 104, 56, 1.31],
      ["traffic", 26, 126, 0.8],
      ["balance", 232, 123, 0.68],
    ],
    [
      "escolha-tecnica-de-modelos",
      "Ábaco que decide o modelo pela conta",
      "podium",
      ["prism", 106, 60, 1.28],
      ["abacus", 27, 127, 0.79],
      ["chip", 232, 122, 0.66],
    ],
    [
      "modelagem-de-ameacas",
      "Mapa que marca por onde o perigo entra",
      "wall",
      ["map", 104, 58, 1.3],
      ["radar", 27, 126, 0.8],
      ["shield", 233, 122, 0.68],
    ],
    [
      "revisao-de-permissoes-e-acesso",
      "Portão que confere dono, empresa e papel",
      "room",
      ["gate", 106, 56, 1.3],
      ["key", 28, 128, 0.8],
      ["tenants", 232, 122, 0.68],
    ],
    [
      "priorizacao-de-vulnerabilidades",
      "Funil que separa a falha urgente do ruído",
      "rails",
      ["funnel", 105, 58, 1.3],
      ["bug", 27, 127, 0.8],
      ["clock", 233, 123, 0.67],
    ],
    [
      "cadeia-de-suprimentos-de-software",
      "Esteira que confere cada pacote recebido",
      "rails",
      ["conveyor", 104, 60, 1.28],
      ["receipt", 26, 126, 0.8],
      ["lens", 232, 124, 0.68],
    ],
    [
      "resposta-a-incidentes-de-seguranca",
      "Lanterna que preserva a prova na crise",
      "field",
      ["flashlight", 106, 58, 1.3],
      ["proof", 28, 128, 0.78],
      ["metronome", 233, 124, 0.66],
    ],
    [
      "incidente-de-dados-lgpd",
      "Relógio que conta os dias úteis da comunicação",
      "desk",
      ["calendar", 104, 58, 1.3],
      ["megaphone", 28, 127, 0.79],
      ["shield", 233, 123, 0.67],
    ],
    [
      "mapa-de-dados-lgpd",
      "Atlas de quem guarda cada dado e até quando",
      "shelves",
      ["atlas", 105, 58, 1.3],
      ["schema", 27, 128, 0.78],
      ["balance", 232, 122, 0.68],
    ],
    [
      "recuperacao-testada-de-backups",
      "Cofre que só conta quando volta inteiro",
      "field",
      ["vault", 104, 58, 1.3],
      ["sync", 27, 127, 0.79],
      ["clock", 233, 124, 0.66],
    ],
    [
      "seguranca-de-aplicacoes-com-llm",
      "Muralha entre o modelo e o que ele alcança",
      "wall",
      ["wall", 104, 58, 1.3],
      ["bubble", 28, 127, 0.79],
      ["plug", 233, 123, 0.67],
    ],
    [
      "decisoes-de-arquitetura-adr",
      "Pergaminho que guarda o porquê da escolha",
      "desk",
      ["scroll", 105, 57, 1.31],
      ["balance", 27, 127, 0.79],
      ["branch", 233, 123, 0.67],
    ],
    [
      "revisao-de-arquitetura-por-atributos",
      "Balança entre o que o negócio pede e o desenho",
      "bridge",
      ["blueprint", 104, 58, 1.3],
      ["metronome", 27, 127, 0.79],
      ["ruler", 233, 123, 0.67],
    ],
    [
      "modernizacao-de-sistemas-legados",
      "Andaime que troca o sistema aos poucos",
      "path",
      ["scaffold", 104, 58, 1.3],
      ["bridge", 27, 127, 0.79],
      ["door", 233, 123, 0.67],
    ],
    [
      "migracao-de-banco-sem-parada",
      "Trilhos que trocam o banco com o trem andando",
      "rails",
      ["database", 104, 58, 1.3],
      ["layers", 27, 127, 0.79],
      ["traffic", 233, 123, 0.67],
    ],
    [
      "observabilidade-e-slos",
      "Observatório que escuta o que o usuário sente",
      "orbit",
      ["observatory", 105, 58, 1.3],
      ["pulse", 27, 127, 0.79],
      ["chart", 233, 123, 0.67],
    ],
    [
      "marketing-de-conteudo-b2b",
      "Valor traduzido em uma mensagem verificável",
      "desk",
      ["megaphone", 111, 60, 1.23],
      ["document", 27, 121, 0.83],
      ["compass", 231, 128, 0.7],
    ],
    [
      "math-olympiad",
      "Arena geométrica de prova e contraprova",
      "podium",
      ["proof", 95, 51, 1.38],
      ["lens", 226, 112, 0.79, 0, "trace"],
      ["formula", 22, 133, 0.77],
    ],
    [
      "mcp-integration",
      "Conector de contextos com transporte delimitado",
      "bridge",
      ["plug", 110, 42, 1.34, 0, "breathe"],
      ["terminal", 22, 126, 0.86],
      ["cloud", 221, 111, 0.87],
      ["key", 142, 165, 0.4],
    ],
    [
      "meeting-briefing",
      "Mesa de contexto antes da negociação",
      "desk",
      ["table", 67, 128, 1.58],
      ["calendar", 27, 65, 0.76],
      ["balance", 125, 43, 0.96],
      ["document", 233, 79, 0.67],
    ],
    [
      "pagamentos-recorrentes-asaas",
      "Relógio de cobranças sem duplicar eventos",
      "orbit",
      ["clock", 112, 54, 1.19, 0, "turn"],
      ["receipt", 27, 124, 0.8],
      ["sync", 227, 126, 0.7],
      ["database", 134, 165, 0.41],
    ],
    [
      "plataformas-de-ensino-online",
      "Campus com acesso, aulas e progresso",
      "field",
      ["campus", 83, 55, 1.53],
      ["books", 26, 142, 0.66],
      ["key", 242, 127, 0.58],
      ["film", 132, 157, 0.47],
    ],
    [
      "playground",
      "Mesa interativa de controles e prévia",
      "desk",
      ["window", 102, 45, 1.37],
      ["sliders", 26, 109, 0.94, 0, "trace"],
      ["flask", 234, 130, 0.64],
    ],
    [
      "plugin-settings",
      "Preferências locais diante da extensão",
      "room",
      ["sliders", 104, 49, 1.39],
      ["plugin", 25, 127, 0.82],
      ["notebook", 235, 112, 0.69],
    ],
    [
      "plugin-structure",
      "Arquitetura de uma extensão portátil",
      "field",
      ["scaffold", 99, 47, 1.49],
      ["plugin", 28, 127, 0.76],
      ["case", 229, 140, 0.71],
      ["schema", 137, 77, 0.42],
    ],
    [
      "portfolio-de-projetos",
      "Arquivo de projetos com rota de retomada",
      "shelves",
      ["portfolio", 100, 79, 1.29],
      ["map", 24, 125, 0.78],
      ["key", 237, 129, 0.57],
      ["clock", 235, 39, 0.47],
    ],
    [
      "power-bi-embedded-portais",
      "Janela de indicadores com acesso isolado",
      "room",
      ["embedded", 72, 53, 1.63],
      ["key", 224, 128, 0.7],
      ["tenants", 27, 143, 0.6],
    ],
    [
      "power-bi-modelagem-dax-performance",
      "Cartografia de métricas reconciliadas",
      "desk",
      ["star", 105, 47, 1.31],
      ["formula", 24, 128, 0.83],
      ["balance", 229, 121, 0.75],
      ["chart", 134, 164, 0.4],
    ],
    [
      "power-bi-relatorios-como-codigo",
      "Relatório visual ligado à sua fonte versionada",
      "shelves",
      ["layout", 103, 56, 1.27],
      ["schema", 25, 125, 0.76],
      ["branch", 230, 124, 0.75, 0, "trace"],
    ],
    [
      "power-platform-code-first",
      "Aplicativo e fluxo construídos na mesma oficina",
      "desk",
      ["phone", 27, 80, 1.16],
      ["workflow", 125, 42, 1.22, 0, "trace"],
      ["gears", 232, 133, 0.64],
    ],
    [
      "project-artifact",
      "Sala de status com frentes e decisões",
      "room",
      ["window", 89, 57, 1.41],
      ["workflow", 25, 133, 0.75],
      ["calendar", 237, 125, 0.66],
      ["review", 146, 163, 0.39],
    ],
    [
      "propostas-comerciais-e-estimativas",
      "Escopo medido antes de entrar na proposta",
      "desk",
      ["document", 101, 45, 1.47],
      ["ruler", 25, 111, 0.91, 12],
      ["abacus", 229, 133, 0.73],
    ],
    [
      "prospeccao-b2b-linkedin",
      "Radar transforma um sinal em conversa",
      "orbit",
      ["radar", 103, 45, 1.33, 0, "turn"],
      ["dialog", 25, 137, 0.79],
      ["lens", 232, 130, 0.65],
    ],
    [
      "prospeccao-drivedata",
      "Bússola comercial entre necessidades e ofertas",
      "path",
      ["compass", 111, 53, 1.19, 0, "turn"],
      ["portfolio", 25, 128, 0.85],
      ["megaphone", 227, 124, 0.74],
    ],
    [
      "prototipos-e-especificacao-funcional",
      "Protótipo navegável com fronteiras de escopo",
      "desk",
      ["window", 87, 52, 1.48],
      ["spec", 26, 135, 0.72],
      ["cursor", 232, 137, 0.67, 0, "lift"],
      ["workflow", 134, 163, 0.43],
    ],
    [
      "receipts",
      "Caderno de atividade apoiado em evidências",
      "desk",
      ["receipt", 107, 48, 1.37],
      ["branch", 27, 124, 0.84],
      ["lens", 227, 129, 0.75, 0, "trace"],
    ],
    [
      "review-contract",
      "Cláusulas revistas contra o playbook",
      "desk",
      ["review", 97, 49, 1.42],
      ["balance", 25, 124, 0.79],
      ["books", 237, 119, 0.65],
    ],
    [
      "saas-multi-tenant-supabase",
      "Cofre com compartimentos por organização",
      "room",
      ["tenants", 104, 52, 1.4],
      ["shield", 25, 127, 0.82],
      ["database", 235, 132, 0.67],
      ["key", 143, 159, 0.39],
    ],
    [
      "security-and-hardening",
      "Defesas construídas na fronteira de entrada",
      "wall",
      ["shield", 111, 48, 1.39],
      ["wall", 24, 136, 0.77],
      ["plug", 233, 120, 0.69],
      ["key", 128, 170, 0.39],
    ],
    [
      "security-audit",
      "Lanterna revela a fronteira de confiança",
      "room",
      ["flashlight", 87, 61, 1.33, 0, "trace"],
      ["wall", 211, 100, 0.88],
      ["review", 25, 132, 0.75],
    ],
    [
      "session-report",
      "Observatório de consumo por sessão",
      "field",
      ["observatory", 103, 42, 1.49],
      ["chart", 25, 137, 0.8],
      ["clock", 237, 129, 0.62],
      ["notebook", 135, 158, 0.44],
    ],
    [
      "shipping-and-launch",
      "Torre de lançamento com rota de recuperação",
      "field",
      ["rocket", 114, 38, 1.45, 0, "lift"],
      ["tower", 37, 99, 0.98],
      ["shield", 235, 129, 0.65],
      ["branch", 182, 151, 0.45],
    ],
    [
      "siege",
      "Fortaleza de argumentos sob contraprova",
      "podium",
      ["fort", 92, 64, 1.46],
      ["proof", 24, 134, 0.77],
      ["lens", 231, 110, 0.77, 0, "trace"],
    ],
    [
      "signature-request",
      "Pacote de assinatura com anexos conferidos",
      "desk",
      ["document", 77, 59, 1.27],
      ["quill", 191, 52, 1.12, 0, "trace"],
      ["review", 26, 147, 0.56],
      ["key", 232, 163, 0.45],
    ],
    [
      "sites-institucionais-e-seo",
      "Vitrine legível encontrada pela busca",
      "field",
      ["store", 87, 53, 1.48],
      ["lens", 226, 117, 0.79, 0, "trace"],
      ["dialog", 25, 143, 0.66],
    ],
    [
      "skill-development",
      "Saberes encadernados com gatilho de ativação",
      "shelves",
      ["books", 91, 61, 1.35],
      ["trigger", 229, 111, 0.78, 0, "breathe"],
      ["scroll", 27, 130, 0.65],
    ],
    [
      "solo",
      "Uma demonstração preservada no caderno",
      "desk",
      ["notebook", 100, 50, 1.41],
      ["proof", 25, 131, 0.8],
      ["pen", 236, 115, 0.73, 0, "trace"],
    ],
    [
      "telegram-access",
      "Portaria de remetentes antes da mensagem",
      "wall",
      ["gate", 108, 51, 1.45],
      ["telegram", 26, 122, 0.83],
      ["key", 235, 136, 0.61],
    ],
    [
      "telegram-configure",
      "Estação de mensagem entre credencial e sinal",
      "room",
      ["telegram", 107, 53, 1.28],
      ["antenna", 24, 115, 0.91, 0, "breathe"],
      ["sliders", 233, 117, 0.73],
    ],
    [
      "triage-nda",
      "Semáforo de revisão para confidencialidade",
      "desk",
      ["traffic", 112, 42, 1.47],
      ["document", 24, 123, 0.83],
      ["vault", 224, 132, 0.77],
    ],
    [
      "vendor-check",
      "Arquivo contratual com vigência sob conferência",
      "shelves",
      ["archive", 111, 67, 1.28],
      ["calendar", 26, 127, 0.79],
      ["lens", 231, 130, 0.71, 0, "trace"],
    ],
    [
      "video-interaction-mapper",
      "Gestos observados viram quadros de storyboard",
      "rails",
      ["film", 28, 77, 0.97],
      ["artboard", 183, 74, 1.1],
      ["cursor", 127, 130, 0.75, 0, "lift"],
      ["lens", 243, 163, 0.38],
    ],
    [
      "video-programatico-reels",
      "Cenas programadas encontram o relógio do vídeo",
      "desk",
      ["clapper", 105, 44, 1.42],
      ["clock", 24, 133, 0.79, 0, "turn"],
      ["film", 229, 127, 0.74],
    ],
    [
      "writing-hookify-rules",
      "Padrões observados antes de alertar ou bloquear",
      "rails",
      ["regex", 88, 55, 1.43],
      ["hook", 26, 126, 0.8],
      ["traffic", 235, 124, 0.71, 0, "breathe"],
    ],
  ];
  const settings = {
    desk: p(
      "M24 190L148 157 296 193 171 231ZM24 190V200L171 241 296 203V193",
      "scene-floor",
    ),
    room: p(
      "M28 196V65L147 29 290 70V197L169 231ZM28 65L169 109 290 70M169 109V231",
      "scene-room",
    ),
    bridge: p(
      "M20 191L124 165 297 190M31 194V221M285 193V219M31 208L162 238 285 213M66 183V210M250 185V217",
      "scene-floor",
    ),
    shelves: p(
      "M28 63H292M28 137H292M28 211H292M36 48V224M284 48V224",
      "scene-room",
    ),
    orbit:
      e(160, 148, 127, 69, "scene-room") +
      p("M33 148H287M160 79V217", "scene-room"),
    path: p(
      "M24 205L94 175 169 205 241 168 299 187M24 216L94 186 169 216 241 179 299 198",
      "scene-floor",
    ),
    podium: p(
      "M75 191L159 167 246 192V210L162 236 75 210ZM75 191L162 216 246 192M162 216V236",
      "scene-floor",
    ),
    wall: p(
      "M22 203V45H298V203M22 89H298M22 146H298M84 45V89M222 45V89M152 89V146M84 146V203M222 146V203",
      "scene-room",
    ),
    rails: p(
      "M22 197H298M22 211H298M36 197V211M69 197V211M102 197V211M135 197V211M168 197V211M201 197V211M234 197V211M267 197V211",
      "scene-floor",
    ),
    field: p(
      "M22 207L157 170 299 207M55 218L157 190 266 219M91 229L157 211 228 230",
      "scene-floor",
    ),
  };
  const index = new Map(
    scenes.map(([id, title, setting, ...objects]) => [
      id,
      { id, title, setting, objects },
    ]),
  );
  function body(id) {
    const scene = index.get(id);
    if (!scene) return primitives.artboard;
    return (
      settings[scene.setting] +
      scene.objects
        .map(
          ([type, x, y, scale = 1, rotation = 0, motion = ""]) =>
            `<g transform="translate(${x} ${y}) scale(${scale}) rotate(${rotation} 50 50)"><g${motion ? ` class="scene-${motion}"` : ""}>${primitives[type]}</g></g>`,
        )
        .join("")
    );
  }
  function render(id) {
    return `<svg class="skill-scene" viewBox="0 0 320 260" aria-hidden="true" focusable="false"><g class="scene-ink" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body(id)}</g></svg>`;
  }
  return Object.freeze({
    render,
    body,
    scenes: Object.freeze([...index.values()]),
    primitiveNames: Object.freeze(Object.keys(primitives)),
  });
});
