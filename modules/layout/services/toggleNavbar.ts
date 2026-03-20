export function toggleNavbar() {
  const navbar = document.getElementById("navbar");
  const overlay = document.getElementById("overlay");

  if (navbar && overlay) {
    navbar.classList.toggle("max-w-[57px]");
    navbar.classList.toggle("max-w-[240px]");
    navbar.classList.toggle("-translate-x-16");
    navbar.classList.toggle("translate-x-0");
    overlay.classList.toggle("hidden");
  }
}
