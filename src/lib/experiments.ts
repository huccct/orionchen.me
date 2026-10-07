export const experiments = [
  {
    slug: 'fly-cube',
    image: 'seismoscope',
    zh: ['候风地动仪', '触发地震，看清机械原理'],
    en: ['Seismoscope', 'Trigger a quake. Follow the mechanism.'],
  },
  {
    slug: 'west-lake',
    image: 'west-lake',
    zh: ['湖上望雷峰', '从湖面到重檐，换个角度看杭州'],
    en: ['Leifeng Pagoda', 'Explore the architecture in 3D.'],
  },
  {
    slug: 'water-rings',
    image: 'water-rings',
    zh: ['水中套圈机', '按一下水泵，找回小时候的手感'],
    en: ['Water Ring Toss', 'A little water, a little childhood.'],
  },
  {
    slug: 'wall-slime',
    image: 'wall-slime',
    zh: ['啪叽。', '抓住、甩出去，看软胶慢慢滑落'],
    en: ['Splat!', 'Fling some slime. Watch it slide.'],
  },
  {
    slug: 'a1-printer',
    image: 'a1-printer',
    zh: ['A1 打印桌', '绕着打印机，看形状逐层生长'],
    en: ['A1 Print Desk', 'Watch a shape grow, layer by layer.'],
  },
  {
    slug: 'chladni',
    image: 'chladni',
    zh: ['声波沙纹', '让沙粒画出声音的形状'],
    en: ['Chladni', 'Let grains of sand trace a standing wave.'],
  },
] as const

// Only fifteen pairs; exclude the last pair without retrying random draws.
export function pickExperimentPair(previous: string | null, random = Math.random) {
  const pairs = experiments
    .flatMap((_, first) =>
      experiments.slice(first + 1).map((_, offset) => [first, first + offset + 1])
    )
    .filter((pair) => pair.join(',') !== previous)
  return pairs[Math.floor(random() * pairs.length)]!
}
