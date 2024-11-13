def build_header(header_logo, page_names):
    base_text = """<header id="main-header">
        <a href="#">
            <img src="images/AdrienWebLogo.png" alt="logo" id="mainheaderlogo">
        </a>
        <div id="hamburger">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div id="dropdown-menu">
            <a href="html/aboutpage.html">About</a>
            <a href="html/menupage.html">Menu</a>
            <a href="html/locationspage.html">Locations</a>
            <a href="html/employmentpage.html">Employment</a>
            <a href="html/contactpage.html">Contact</a>
            <a href="html/storypage.html">Our Story</a>
        </div>
        <ul>
            <li>
                <a href="html/aboutpage.html">Projects</a>
            </li>
            <li>
                <a href="html/menupage.html">Skills</a>
            </li>
        </ul>
        <div id="socials">
            <a href="https://github.com/babetCode" target="_blank">
                <img src="images/github.png" alt="facebook">
            </a>
            <a href="https://www.instagram.com/adrien.babet/?hl=en" target="_blank">
                <img src="images/instagram.png" alt="instagram">
            </a>
        </div>
    </header>"""
    print(base_text)
    return 1
build_header(1,1)