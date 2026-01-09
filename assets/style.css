/* ===== Base ===== */
:root{
  --topbar-h: 56px;
  --sidebar-w: 280px;

  --bg: #f4f6f8;
  --ink: #0b1a2b;

  --blue: #1976c9;
  --blue-dark: #0b1a2b;
  --white: #fff;
}

*{ box-sizing: border-box; }

html, body{
  height: 100%;
}

body{
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: var(--ink);
  background: var(--bg);
}

/* ===== Topbar ===== */
.topbar{
  height: var(--topbar-h);
  background: var(--blue-dark);
  color: var(--white);
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.brand{
  font-weight: 700;
  letter-spacing: .2px;
}

/* ===== Layout ===== */
.shell{
  min-height: calc(100vh - var(--topbar-h));
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
}

/* ===== Sidebar ===== */
.sidebar{
  background: var(--blue);
  padding: 14px;
  position: sticky;
  top: var(--topbar-h);
  height: calc(100vh - var(--topbar-h));
  overflow: auto;
}

.menu-link{
  display: block;
  color: var(--white);
  text-decoration: none;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  font-weight: 500;
  line-height: 1.2;
}

.menu-link:hover{
  background: rgba(255,255,255,.14);
}

.menu-link.active{
  background: rgba(255,255,255,.22);
}

.menu-link.sub{
  margin-left: 18px;
  padding-left: 12px;
  font-size: .95rem;
  opacity: .95;
}

/* ===== Main ===== */
.main{
  padding: 28px;
  max-width: 1100px;
}

.main h1{
  margin: 0 0 12px 0;
  font-size: 36px;
}

/* ===== Responsive (pantallas chicas) =====
   - Menú arriba (no queda "feo"), contenido abajo bien espaciado */
@media (max-width: 900px){
  :root{ --sidebar-w: 1fr; }

  .shell{
    grid-template-columns: 1fr;
  }

  .sidebar{
    position: relative;
    top: 0;
    height: auto;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .main{
    padding: 18px;
  }

  .main h1{
    font-size: 30px;
  }
}
