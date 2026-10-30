
"use client";

import { useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Menu,
  MapPin,
  Phone,
  Heart,
  Leaf,
  Truck,
  ShieldCheck,
  Utensils,
  Clock,
} from "lucide-react";

const ampesiImage = "/images/ampesi-hero.jpg";
const avocadoAmpesiImage =
  "/images/ampesi-fish-wele-egg-avocado.png";
const saladImage = "/images/vegetable-salad.jpg";

type Dish = {
  id: number;
  name: string;
  category: "Ampesi" | "Salad";
  description: string;
  price: number;
  tag: string;
  image: string;
};

type CartItem = {
  dish: Dish;
  quantity: number;
};

const dishes: Dish[] = [
  {
    id: 1,
    name: "Ampesi with Fish & Wele",
    category: "Ampesi",
    description:
      "Enjoy tender boiled yam and ripe plantain paired with tasty fish, savoury wele and delicious stew.",
    price: 30,
    tag: "LOCAL FAVOURITE",
    image: ampesiImage,
  },
  {
    id: 2,
    name: "Ampesi with Fish, Wele & Egg",
    category: "Ampesi",
    description:
      "Take your ampesi experience up a notch with flavourful fish, wele and egg, served with boiled yam, plantain and stew.",
    price: 35,
    tag: "DELICIOUS CHOICE",
    image: ampesiImage,
  },
  {
    id: 3,
    name: "Ampesi with Fish, Wele, Egg & Avocado",
    category: "Ampesi",
    description:
      "The complete combination! Boiled yam and plantain with fish, wele, egg and creamy avocado for an extra satisfying meal.",
    price: 40,
    tag: "FULL COMBINATION",
    image: avocadoAmpesiImage,
  },
  {
    id: 4,
    name: "Vegetable Salad",
    category: "Salad",
    description:
      "A colourful, refreshing mix of fresh vegetables for a light and delicious meal.",
    price: 25,
    tag: "FRESH & LIGHT",
    image: saladImage,
  },
];

const foodEmojis = ["🥑", "🍠", "🍌", "🥬", "🍅", "🌶️"];

const navigationLinks = [
  { name: "Home", link: "#home" },
  { name: "Our Story", link: "#story" },
  { name: "Menu", link: "#menu" },
  { name: "Contact", link: "#contact" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 500], [0, 100]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 180,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 180,
    damping: 22,
  });
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), {
    stiffness: 180,
    damping: 22,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), {
    stiffness: 180,
    damping: 22,
  });

  const handleHeroPointerMove = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroPointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const filteredDishes = useMemo(() => {
    if (activeCategory === "All") return dishes;

    return dishes.filter(
      (dish) => dish.category === activeCategory
    );
  }, [activeCategory]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.dish.price * item.quantity,
    0
  );

  const addToCart = (dish: Dish) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.dish.id === dish.id
      );

      if (existing) {
        return current.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { dish, quantity: 1 }];
    });
  };

  const changeQuantity = (dishId: number, amount: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getQuantity = (dishId: number) => {
    return (
      cart.find((item) => item.dish.id === dishId)?.quantity ?? 0
    );
  };

  const exploreMenu = () => {
    setMobileMenuOpen(false);
    document
      .getElementById("menu")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const exploreSalad = () => {
    setActiveCategory("Salad");
    document
      .getElementById("menu")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const checkout = () => {
    if (cart.length === 0) return;

    const orderDetails = cart
      .map(
        (item) =>
          `${item.quantity} x ${item.dish.name} - GH₵${item.dish.price * item.quantity}`
      )
      .join("\n");

    const message = `Hello Trudible Cuisine! I would like to place an order:\n\n${orderDetails}\n\nTotal: GH₵${cartTotal}\n\nPlease let me know how to proceed.`;

    window.open(
      `https://wa.me/233549930719?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="overflow-hidden bg-white text-[#242020]">
      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-gray-100 bg-[#fffdfc]/95 backdrop-blur-xl">
        <div className="container relative mx-auto flex h-[78px] items-center justify-between gap-3">
          {/* LOGO */}
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="flex min-w-0 items-center gap-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b91c32] text-white sm:h-11 sm:w-11">
              <Utensils size={21} />
            </div>

            <div>
              <h1 className="whitespace-nowrap text-base font-black leading-none tracking-tight sm:text-lg">
                Trudible
                <span className="text-[#b91c32]"> Cuisine</span>
              </h1>

              <p className="mt-1 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[2px] text-gray-500 sm:text-[9px] sm:tracking-[3px]">
                Our Kitchen To Your Heart
              </p>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            {navigationLinks.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="transition hover:text-[#b91c32]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex shrink-0 items-center gap-2">
            {/* MY ORDER */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
              className="relative flex items-center gap-2 rounded-full bg-[#b91c32] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#941329] sm:px-5 sm:text-sm"
            >
              <ShoppingBag size={17} />
              <span className="hidden sm:inline">My Order</span>

              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-[#b91c32]">
                {cartCount}
              </span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() =>
                setMobileMenuOpen((open) => !open)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f0] text-[#b91c32] transition hover:bg-[#ffe1e1] md:hidden"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>

          {/* MOBILE NAVIGATION */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 right-0 top-full overflow-hidden border-t border-gray-100 bg-white shadow-xl md:hidden"
              >
                <div className="container mx-auto flex flex-col py-3">
                  {navigationLinks.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.link}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="border-b border-gray-100 px-3 py-4 text-sm font-bold transition hover:bg-[#fff7f5] hover:text-[#b91c32] last:border-0"
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-[760px] overflow-hidden bg-[#8e1025] pt-[78px] text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.15),transparent_35%),linear-gradient(120deg,#8e1025,#bd263a)]" />

        <div className="absolute -right-32 top-20 h-[550px] w-[550px] rounded-full border border-white/10" />
        <div className="absolute -right-20 top-32 h-[430px] w-[430px] rounded-full border border-white/10" />

        {foodEmojis.map((emoji, index) => (
          <motion.div
            key={emoji}
            className="absolute hidden text-4xl opacity-40 md:block"
            style={{
              left: `${10 + index * 14}%`,
              top: `${20 + (index % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 12, -12, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        ))}

        <div className="container relative z-10 mx-auto grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[2px]">
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              Our Kitchen To Your Heart
            </span>

            <h2 className="max-w-[650px] text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
              Tired of eating
              <span className="block text-[#ffd66b]">
                rice everyday?
              </span>
            </h2>

            <p className="mt-7 max-w-[520px] text-base leading-8 text-white/80 md:text-lg">
              Trudible Cuisine has got you! Switch things up with
              our delicious Ampesi. And to everyone looking for a
              fresh option, order our vegetable salad for a
              delicious meal. Good food, great taste and
              satisfaction in every bite.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={exploreMenu}
                className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-[#a71930] transition hover:bg-[#ffd66b]"
              >
                Explore Our Menu
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#story"
                className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-4 font-semibold transition hover:bg-white/10"
              >
                Discover Us
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-black">100%</p>
                <p className="mt-1 text-xs text-white/65">
                  Good food vibes
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">Fresh</p>
                <p className="mt-1 text-xs text-white/65">
                  Food experience
                </p>
              </div>

              <div>
                <p className="text-2xl font-black">Ghana</p>
                <p className="mt-1 text-xs text-white/65">
                  Local goodness
                </p>
              </div>
            </div>
          </motion.div>

          <div
            onPointerMove={handleHeroPointerMove}
            onPointerLeave={handleHeroPointerLeave}
            className="relative flex min-h-[460px] items-center justify-center [perspective:1200px]"
          >
            {/* Ambient golden aura (subtle, non-breathing) */}
            <div className="absolute h-[380px] w-[380px] rounded-full bg-[#ffd66b]/20 blur-3xl md:h-[480px] md:w-[480px]" />

            {/* Concentric Orbital Ring 1 - Outer Dashed Track */}
            <motion.div
              className="pointer-events-none absolute h-[460px] w-[460px] rounded-full border border-dashed border-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#ffd66b] shadow-[0_0_14px_#ffd66b]" />
            </motion.div>

            {/* Concentric Orbital Ring 2 - Inner Golden Ring */}
            <motion.div
              className="pointer-events-none absolute h-[530px] w-[530px] rounded-full border border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -bottom-1.5 right-1/4 h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_0_10px_white]" />
            </motion.div>

            {/* Gentle Rising Steam Wisps above the hot dish */}
            <div className="pointer-events-none absolute -top-10 left-1/2 z-30 flex -translate-x-1/2 gap-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-16 w-3 rounded-full bg-gradient-to-t from-white/35 via-white/15 to-transparent blur-sm"
                  animate={{
                    y: [0, -40, -65],
                    x: [0, (i - 1) * 10, (i - 1) * 18],
                    opacity: [0, 0.7, 0],
                    scaleY: [0.8, 1.3, 1.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.95,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* 3D Tilt Dish Container */}
            <motion.div
              style={{
                y: heroImageY,
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: "preserve-3d",
              }}
              initial={{
                opacity: 0,
                y: -650,
                rotate: -18,
                scale: 0.65,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                scale: 1,
              }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                type: "spring",
                stiffness: 65,
              }}
              className="relative z-10 w-full max-w-[530px]"
            >
              {/* Platter Frame with Specular Glare */}
              <div
                className="relative overflow-hidden rounded-[45%] border-[10px] border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_35px_80px_rgba(0,0,0,0.6)]"
                style={{ transform: "translateZ(30px)" }}
              >
                <img
                  src={ampesiImage}
                  alt="Ampesi with fish and traditional stew"
                  className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Dynamic Glare Reflection */}
                <motion.div
                  className="pointer-events-none absolute inset-0 mix-blend-overlay"
                  style={{
                    background: useTransform(
                      [glareX, glareY],
                      ([x, y]) =>
                        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.45) 0%, transparent 60%)`
                    ),
                  }}
                />
              </div>

              {/* Floating Avocado Garnish Badge with 3D Depth */}
              <motion.div
                style={{ transform: "translateZ(65px)" }}
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 6, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-3 top-12 flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-2xl md:-right-7"
              >
                🥑
              </motion.div>

              {/* Floating Yam Garnish Badge with 3D Depth */}
              <motion.div
                style={{ transform: "translateZ(75px)" }}
                animate={{
                  y: [0, 6, 0],
                  rotate: [0, -6, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-3 left-0 flex h-20 w-20 items-center justify-center rounded-full bg-[#ffd66b] text-4xl shadow-2xl"
              >
                🍠
              </motion.div>

              {/* Deliciousness Card with 3D Depth */}
              <div
                style={{ transform: "translateZ(85px)" }}
                className="absolute -bottom-5 right-8 rounded-2xl bg-white px-5 py-3 text-[#242020] shadow-2xl transition-transform duration-300 hover:scale-105"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[#b91c32]">
                  Deliciousness
                </p>
                <p className="text-lg font-black">
                  In Every Bite!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-20 -mt-1 bg-white py-10">
        <div className="container mx-auto grid grid-cols-2 gap-7 md:grid-cols-4">
          {[
            {
              icon: Leaf,
              title: "Fresh Ingredients",
              text: "Made with care",
            },
            {
              icon: Heart,
              title: "Homemade Goodness",
              text: "Food with love",
            },
            {
              icon: Truck,
              title: "Order With Ease",
              text: "Simple ordering",
            },
            {
              icon: ShieldCheck,
              title: "Quality Service",
              text: "Customer focused",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#b91c32]">
                <feature.icon size={23} />
              </div>

              <div>
                <h3 className="text-sm font-black">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {feature.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="section-padding bg-[#fffafa]">
        <div className="container mx-auto">
          <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[3px] text-[#b91c32]">
                What We're Serving
              </span>

              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Explore Our{" "}
                <span className="text-[#b91c32]">Menu</span>
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-gray-500">
                Good food does not have to be complicated. Find
                something delicious and make it yours.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Ampesi", "Salad"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-6 py-3 text-sm font-bold transition ${
                    activeCategory === category
                      ? "bg-[#b91c32] text-white shadow-lg shadow-red-200"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#b91c32] hover:text-[#b91c32]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish) => (
                <motion.article
                  layout
                  key={dish.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className="group overflow-hidden rounded-[26px] border border-gray-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-[230px] w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[9px] font-black tracking-wider text-[#b91c32] shadow">
                      {dish.tag}
                    </span>

                    <div className="absolute bottom-4 right-4 rounded-full bg-[#b91c32] px-4 py-2 text-sm font-black text-white shadow-lg">
                      GH₵{dish.price}
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-[#b91c32]">
                      {dish.category}
                    </p>

                    <h3 className="mt-2 min-h-[52px] text-lg font-black leading-6">
                      {dish.name}
                    </h3>

                    <p className="mt-3 min-h-[90px] text-sm leading-6 text-gray-500">
                      {dish.description}
                    </p>

                    <button
                      onClick={() => addToCart(dish)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#fff0f0] py-3 text-sm font-black text-[#b91c32] transition hover:bg-[#b91c32] hover:text-white"
                    >
                      {getQuantity(dish.id) > 0 ? (
                        <>
                          <ShoppingBag size={17} />
                          Added ({getQuantity(dish.id)})
                        </>
                      ) : (
                        <>
                          <Plus size={17} />
                          Add To Order
                        </>
                      )}
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* SALAD PROMOTION */}
      <section className="relative overflow-hidden bg-[#f9e9e6] py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-5 -top-5 h-32 w-32 rounded-full bg-[#b91c32]/10" />

            <motion.img
              whileHover={{ scale: 1.04, rotate: 1 }}
              src={saladImage}
              alt="Fresh vegetable salad"
              className="relative z-10 h-[380px] w-full rounded-[35px] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-5 -right-3 z-20 rounded-2xl bg-white px-6 py-4 shadow-xl">
              <p className="text-xs font-bold text-gray-500">
                A fresh option
              </p>
              <p className="text-2xl font-black text-[#b91c32]">
                GH₵25
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-black uppercase tracking-[3px] text-[#b91c32]">
              Something Fresh
            </span>

            <h2 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
              For Our
              <span className="block text-[#b91c32]">
                Girlies!
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-8 text-gray-600">
              Looking for something fresh and colourful? Our
              vegetable salad is a refreshing option when you
              want something different. Simple, delicious and
              ready to brighten your day.
            </p>

            <button
              onClick={exploreSalad}
              className="mt-8 flex items-center gap-3 rounded-full bg-[#b91c32] px-7 py-4 font-bold text-white transition hover:bg-[#941329]"
            >
              Explore Salad
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="section-padding bg-white">
        <div className="container mx-auto grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-xs font-black uppercase tracking-[3px] text-[#b91c32]">
              A Little About Us
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Good Food,
              <span className="block text-[#b91c32]">
                Made With Love.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              At Trudible Cuisine, we believe that good food
              brings happiness. Our goal is to give you a
              satisfying food experience with delicious meals
              that make you want to come back for more.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Whether you are in the mood for our traditional
              Ampesi or a refreshing vegetable salad, we have
              something waiting for you.
            </p>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 font-black text-[#b91c32] hover:gap-4"
            >
              Get In Touch
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="relative">
            <img
              src={avocadoAmpesiImage}
              alt="Ampesi with fish, egg and avocado"
              className="h-[420px] w-full rounded-[35px] object-cover shadow-xl"
            />

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute -bottom-7 -left-5 rounded-2xl bg-[#b91c32] p-6 text-white shadow-xl"
            >
              <Heart size={25} className="mb-2" />
              <p className="text-xl font-black">
                Made With Love
              </p>
              <p className="mt-1 text-xs text-white/75">
                Our Kitchen To Your Heart
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[#fff7f5] py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-black uppercase tracking-[3px] text-[#b91c32]">
              We'd Love To Hear From You
            </span>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Ready To{" "}
              <span className="text-[#b91c32]">Order?</span>
            </h2>

            <p className="mt-5 leading-7 text-gray-500">
              Have a question or want to place an order? Get in
              touch with Trudible Cuisine.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <a
              href="tel:0549930719"
              className="rounded-3xl border border-gray-100 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#b91c32]">
                <Phone size={25} />
              </div>

              <h3 className="mt-4 font-black">Call Us</h3>

              <p className="mt-2 text-sm text-gray-500">
                0549930719
              </p>

              <p className="mt-1 text-sm text-gray-500">
                0201414428
              </p>
            </a>

            <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#b91c32]">
                <MapPin size={25} />
              </div>

              <h3 className="mt-4 font-black">Find Us</h3>

              <p className="mt-2 text-sm text-gray-500">
                Mawed Apartment, Amamoma
              </p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#b91c32]">
                <Clock size={25} />
              </div>

              <h3 className="mt-4 font-black">Ordering</h3>

              <p className="mt-2 text-sm text-gray-500">
                Contact us for order enquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden bg-[#790d20] text-white">
        <div className="overflow-hidden border-b border-white/10 py-5">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max gap-12 whitespace-nowrap text-3xl font-black uppercase tracking-[4px] text-white/15"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index}>
                GOOD FOOD • GREAT TASTE • TRUDIBLE CUISINE •
              </span>
            ))}
          </motion.div>
        </div>

        <div className="container mx-auto grid gap-12 py-16 md:grid-cols-3">
          <div>
            <h2 className="text-3xl font-black">
              Trudible{" "}
              <span className="text-[#ffd66b]">Cuisine</span>
            </h2>

            <p className="mt-3 text-xs font-semibold uppercase tracking-[3px] text-white/50">
              Our Kitchen To Your Heart
            </p>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/65">
              Bringing you delicious food and a satisfying
              experience, one meal at a time.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-black">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-white/65">
              {navigationLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.link}
                  className="hover:text-[#ffd66b]"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black">
              Contact Details
            </h3>

            <div className="mt-5 flex flex-col gap-4 text-sm text-white/65">
              <p className="flex items-center gap-3">
                <Phone size={17} />
                0549930719 / 0201414428
              </p>

              <p className="flex items-center gap-3">
                <MapPin size={17} />
                Mawed Apartment, Amamoma
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto flex flex-col items-center justify-between gap-3 text-center text-xs text-white/50 md:flex-row">
            <p>
              © 2026 Trudible Cuisine. All rights reserved.
            </p>

            <p className="flex items-center gap-2">
              Made with{" "}
              <Heart size={13} className="text-[#ffd66b]" /> for
              good food lovers.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 right-10 text-5xl opacity-10">
          🍲
        </div>

        <div className="pointer-events-none absolute left-10 top-20 text-4xl opacity-10">
          🥑
        </div>
      </footer>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-[450px] flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h2 className="text-2xl font-black">
                    Your Order
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {cartCount} item(s) selected
                  </p>
                </div>

                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full bg-gray-100 p-3 transition hover:bg-gray-200"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f0] text-[#b91c32]">
                      <ShoppingBag size={35} />
                    </div>

                    <h3 className="mt-5 text-xl font-black">
                      Your order is empty
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Explore our menu and add something delicious.
                    </p>

                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 rounded-full bg-[#b91c32] px-6 py-3 text-sm font-bold text-white"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item) => (
                      <div
                        key={item.dish.id}
                        className="flex gap-4 border-b border-gray-100 pb-5"
                      >
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="font-black leading-5">
                            {item.dish.name}
                          </h3>

                          <p className="mt-2 text-sm font-bold text-[#b91c32]">
                            GH₵{item.dish.price}
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <button
                              onClick={() =>
                                changeQuantity(item.dish.id, -1)
                              }
                              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="text-sm font-black">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                changeQuantity(item.dish.id, 1)
                              }
                              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t bg-white p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-semibold text-gray-500">
                      Order Total
                    </span>

                    <span className="text-2xl font-black text-[#b91c32]">
                      GH₵{cartTotal}
                    </span>
                  </div>

                  <button
                    onClick={checkout}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-[#b91c32] py-4 font-black text-white transition hover:bg-[#941329]"
                  >
                    Continue on WhatsApp
                    <ArrowUpRight size={19} />
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    Your order details will be sent to Trudible Cuisine.
                  </p>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
