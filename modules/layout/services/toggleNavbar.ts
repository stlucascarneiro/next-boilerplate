export function toggleNavbar() {
  const navbar = document.getElementById("navbar");
  const overlay = document.getElementById("overlay");

  if (navbar && overlay) {
    navbar.classList.toggle("-translate-x-60");
    navbar.classList.toggle("translate-x-0");
    overlay.classList.toggle("hidden");
  }
}
