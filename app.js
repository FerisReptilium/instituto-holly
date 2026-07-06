/* -------------------------------------------------------------
   LOGIC & INTERACTIVE FEATURES - INSTITUTO HOLLY
   Supports: Supabase Auth & DB (Serverless) + LocalStorage Fallback
------------------------------------------------------------- */

// ==========================================
// CONFIGURAÇÃO DO BANCO DE DADOS (SUPABASE)
// ==========================================
// Para colocar o site online na Vercel com um banco de dados real e sistema de cadastro:
// 1. Crie uma conta gratuita em https://supabase.com
// 2. Crie um projeto e copie a URL do projeto (API URL) e a Anon Key (chave pública).
// 3. Cole os valores abaixo. Caso deixe em branco, o site usará o LocalStorage do navegador.
//
// SQL para rodar no painel do Supabase (SQL Editor) para criar as tabelas:
//
//   create table posts (
//     id text primary key,
//     author text not null,
//     title text not null,
//     category text not null,
//     content text not null,
//     likes int default 0,
//     liked_users text[] default '{}',
//     created_at timestamp with time zone default timezone('utc'::text, now())
//   );
//
//   create table comments (
//     id serial primary key,
//     post_id text references posts(id) on delete cascade,
//     author text not null,
//     text text not null,
//     created_at timestamp with time zone default timezone('utc'::text, now())
//   );
//
const SUPABASE_URL = "https://vrmstyzpshbkcrrfpawc.supabase.co"; // Ex: "https://xyz.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXN0eXpwc2hia2NycmZwYXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDE5NjgsImV4cCI6MjA5ODY3Nzk2OH0.VhZXs188jk7RaowGaTkXm91H_1Cbvt8_rUoycr6a9eA"; // Ex: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase inicializado com sucesso.");
} else {
    console.log("Supabase não configurado. Utilizando fallback de LocalStorage (Modo Offline).");
}

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TEMA CLARO / ESCURO (PERSISTENTE)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    body.className = savedTheme;

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // ==========================================
    // 2. NAV & PROGRESS BAR & MOBILE NAV
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progress-bar');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('.main-header');

    // Menu Hamburguer Mobile
    mobileNavToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        mobileNavToggle.classList.toggle('active');
        const spans = mobileNavToggle.querySelectorAll('span');
        if (mainNav.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            mobileNavToggle.classList.remove('active');
            const spans = mobileNavToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Estado inicial de scroll
    const winScrollInit = document.documentElement.scrollTop || document.body.scrollTop;
    if (winScrollInit > 20) {
        header.classList.add('header-scrolled');
    }

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        if (winScroll > 20) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Active state baseada na seção
        const sections = document.querySelectorAll('section');
        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 3. HISTÓRIA DE MEL E NOTÍCIAS (MODAIS)
    // ==========================================
    const storyModal = document.getElementById('story-modal');
    const btnStory = document.getElementById('btn-story');
    const closeModal = document.getElementById('close-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    btnStory.addEventListener('click', () => {
        storyModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    const btnOpenStoryTribute = document.getElementById('btn-open-story-tribute');
    if (btnOpenStoryTribute) {
        btnOpenStoryTribute.addEventListener('click', () => {
            storyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    const closeStory = () => {
        storyModal.style.display = 'none';
        document.body.style.overflow = '';
    };
    closeModal.addEventListener('click', closeStory);
    modalCloseBtn.addEventListener('click', closeStory);

    // Modal de Artigos Científicos
    const articleModal = document.getElementById('article-modal');
    const closeArticleModal = document.getElementById('close-article-modal');
    const articleModalBody = document.getElementById('article-modal-body');
    const articleButtons = document.querySelectorAll('.read-more-btn');

    const articlesData = {
        "1": {
            image: "./assets/article_love.png",
            category: "Neurobiologia",
            date: "02 de Julho, 2026",
            title: "A Química do Amor: O Efeito da Ocitocina nos Olhos Caninos",
            content: `
                <p>Estudos publicados pela revista científica <em>Science</em> demonstram que o contato visual prolongado entre cães e seus tutores desencadeia um aumento acentuado de <strong>ocitocina</strong>, também conhecida como o hormônio da empatia e do apego, no cérebro de ambos.</p>
                <p>Esse mecanismo de feedback hormonal positivo é evolutivamente muito similar ao que ocorre entre mães humanas e recém-nascidos. Quando o cão olha nos seus olhos, ele ativa ativamente esse laço afetivo, reduzindo os níveis de cortisol (hormônio do estresse) e induzindo uma resposta de calma e segurança no tutor. Cuidar e olhar com afeto é, biologicamente, benéfico para a saúde do tutor e do cão.</p>
            `
        },
        "2": {
            image: "./assets/article_toxic.png",
            category: "Nutrologia Canina",
            date: "30 de Junho, 2026",
            title: "Uvas, Chocolate e Cebola: Por que são Altamente Tóxicos para os Cães?",
            content: `
                <p>O organismo canino metaboliza compostos químicos de maneira diferente do humano. Vários alimentos do nosso cotidiano podem sobrecarregar o fígado e rins dos cães.</p>
                <h4>1. Teobromina no Chocolate</h4>
                <p>O cacau contém teobromina, um estimulante que os cães não conseguem metabolizar rapidamente. Em doses elevadas (especialmente em chocolates amargos), ela causa tremores, convulsões e arritmias cardíacas.</p>
                <h4>2. Insuficiência Renal por Uvas</h4>
                <p>Uvas frescas e uvas-passas causam lesão renal aguda severa em cães por razões que a biologia molecular ainda investiga. Mesmo pequenas porções podem causar vômitos seguidos de colapso urinário.</p>
                <h4>3. Dissulfeto de Alila e N-Propila em Alho e Cebola</h4>
                <p>Estes compostos danificam as hemácias dos cães, levando à ruptura celular e resultando em anemia hemolítica séria. Os sintomas costumam aparecer alguns dias após a ingestão.</p>
            `
        },
        "3": {
            image: "./assets/article_vaccine.png",
            category: "Imunologia Veterinária",
            date: "28 de Junho, 2026",
            title: "Entendendo as Vacinas Múltiplas (V8 e V10): Como Elas Agem no Organismo",
            content: `
                <p>As vacinas V8 e V10 contêm vírus e bactérias atenuadas que estimulam o sistema imunológico a produzir anticorpos de defesa contra enfermidades graves como a Cinomose, Parvovirose, Hepatite Infecciosa Canina e Leptospirose.</p>
                <p>O protocolo inicial na infância (geralmente de 3 doses a partir dos 45 dias) é crucial para sobrepor os anticorpos maternos temporários. Após o ciclo inicial de filhote, a imunologia veterinária prescreve um reforço anual contínuo, mantendo as defesas do cão preparadas contra patógenos oportunistas.</p>
            `
        }
    };

    articleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-article');
            const data = articlesData[id];
            if (data) {
                articleModalBody.innerHTML = `
                    <div class="modal-banner-image" style="width: 100%; height: 220px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px;">
                        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="modal-header" style="margin-bottom: 20px;">
                        <div>
                            <span class="news-category" style="font-size: 0.75rem; font-weight:700; color: var(--accent);">${data.category}</span>
                            <h2 style="font-size: 1.5rem; margin-top: 4px;">${data.title}</h2>
                            <p class="subtitle" style="font-size: 0.8rem; color: var(--text-light);">${data.date}</p>
                        </div>
                    </div>
                    <div class="modal-body" style="line-height: 1.7; font-size: 1rem; margin-bottom: 20px;">
                        ${data.content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="article-close-btn">Fechar</button>
                    </div>
                `;
                articleModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                document.getElementById('article-close-btn').addEventListener('click', () => {
                    articleModal.style.display = 'none';
                    document.body.style.overflow = '';
                });
            }
        });
    });

    closeArticleModal.addEventListener('click', () => {
        articleModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === storyModal) closeStory();
        if (e.target === articleModal) {
            articleModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // ==========================================
    // 4. AUTENTICAÇÃO HÍBRIDA (Supabase / LocalStorage)
    // ==========================================
    const authBtn = document.getElementById('auth-btn');
    const authBtnText = document.getElementById('auth-btn-text');
    const authModal = document.getElementById('auth-modal');
    const closeAuthModal = document.getElementById('close-auth-modal');
    
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const forumLoggedOutMsg = document.getElementById('forum-logged-out-msg');
    const newPostForm = document.getElementById('new-post-form');
    const loggedUserName = document.getElementById('logged-user-name');
    const btnForumLogin = document.getElementById('btn-forum-login');

    // Header User Profile Elements
    const headerUserProfile = document.getElementById('header-user-profile');
    const headerUserAvatar = document.getElementById('header-user-avatar');
    const headerUserName = document.getElementById('header-user-name');

    // Estado da sessão do usuário
    let currentUser = null;

    // Verificar Usuário Logado
    async function checkAuth() {
        if (supabaseClient) {
            // Verificar Supabase Session
            const { data, error } = await supabaseClient.auth.getSession();
            if (data?.session) {
                currentUser = {
                    id: data.session.user.id,
                    name: data.session.user.user_metadata?.display_name || data.session.user.email.split('@')[0],
                    email: data.session.user.email
                };
            } else {
                currentUser = null;
            }
        } else {
            // Verificar LocalStorage
            const stored = localStorage.getItem('logged_user');
            if (stored) {
                currentUser = JSON.parse(stored);
            } else {
                currentUser = null;
            }
        }
        updateAuthUI();
    }

    // Atualizar UI baseado no login
    function updateAuthUI() {
        if (currentUser) {
            authBtnText.textContent = "Sair";
            authBtn.title = `Conectado como ${currentUser.name}`;
            
            if (forumLoggedOutMsg) forumLoggedOutMsg.style.display = 'none';
            if (newPostForm) {
                newPostForm.style.display = 'flex';
                loggedUserName.textContent = currentUser.name;
            }

            // Exibir widget de perfil no cabeçalho
            if (headerUserProfile) {
                headerUserProfile.style.display = 'flex';
                headerUserName.textContent = currentUser.name;
                
                if (currentUser.avatarUrl && (currentUser.avatarUrl.startsWith('http') || currentUser.avatarUrl.startsWith('data:image'))) {
                    headerUserAvatar.style.background = 'none';
                    headerUserAvatar.innerHTML = `<img src="${currentUser.avatarUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                } else {
                    headerUserAvatar.style.background = getAvatarGradient(currentUser.name);
                    headerUserAvatar.style.color = '#ffffff';
                    headerUserAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
                }
            }
        } else {
            authBtnText.textContent = "Entrar";
            authBtn.title = "Entrar na conta";
            
            if (forumLoggedOutMsg) forumLoggedOutMsg.style.display = 'block';
            if (newPostForm) newPostForm.style.display = 'none';

            // Ocultar widget de perfil no cabeçalho
            if (headerUserProfile) {
                headerUserProfile.style.display = 'none';
            }
        }
    }

    // Toggle Modais de Autenticação
    authBtn.addEventListener('click', async () => {
        if (currentUser) {
            // Fazer logout
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            } else {
                localStorage.removeItem('logged_user');
            }
            currentUser = null;
            updateAuthUI();
            showToast("Sessão finalizada.", "info");
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            fetchAndRenderPosts(activeFilter);
        } else {
            // Abrir Modal de login
            openLoginModal();
        }
    });

    btnForumLogin.addEventListener('click', () => openLoginModal());

    function openLoginModal() {
        authModal.style.display = 'flex';
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
        document.body.style.overflow = 'hidden';
    }

    const closeAuth = () => {
        authModal.style.display = 'none';
        document.body.style.overflow = '';
    };
    closeAuthModal.addEventListener('click', closeAuth);

    switchToSignup.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    switchToLogin.addEventListener('click', () => {
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
    });

    // Redimensionar e comprimir imagem para avatar leve (96x96 pixels)
    function resizeAndCompressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = 96;
                    canvas.height = 96;
                    
                    const minSize = Math.min(img.width, img.height);
                    const sx = (img.width - minSize) / 2;
                    const sy = (img.height - minSize) / 2;
                    
                    ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, 96, 96);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                    resolve(compressedBase64);
                };
                img.src = e.target.result;
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    // Helper para obter Avatar do usuário (customizado ou Gravatar)
    async function resolveUserAvatar(email) {
        try {
            const cleanedEmail = email.trim().toLowerCase();
            const msgUint8 = new TextEncoder().encode(cleanedEmail);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return `https://www.gravatar.com/avatar/${hashHex}?d=identicon`;
        } catch (e) {
            return '';
        }
    }

    // Submissão do Cadastro (Signup)
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const avatarFile = document.getElementById('signup-avatar').files[0];

        let resolvedAvatar = '';
        if (avatarFile) {
            resolvedAvatar = await resizeAndCompressImage(avatarFile);
        } else {
            resolvedAvatar = await resolveUserAvatar(email);
        }

        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { display_name: name, avatar_url: resolvedAvatar } }
            });
            if (error) {
                showToast(`Erro no cadastro: ${error.message}`, "error");
            } else {
                showToast("Cadastro realizado! Por favor, verifique seu e-mail para confirmação.", "success");
                closeAuth();
            }
        } else {
            // LocalStorage
            let localUsers = JSON.parse(localStorage.getItem('local_users')) || [];
            if (localUsers.some(u => u.email === email)) {
                showToast("E-mail já cadastrado!", "error");
                return;
            }
            const newUser = { id: 'usr-' + Date.now(), name, email, password, avatarUrl: resolvedAvatar };
            localUsers.push(newUser);
            localStorage.setItem('local_users', JSON.stringify(localUsers));

            currentUser = { id: newUser.id, name: newUser.name, email: newUser.email, avatarUrl: resolvedAvatar };
            localStorage.setItem('logged_user', JSON.stringify(currentUser));
            updateAuthUI();
            closeAuth();
            showToast("Cadastro realizado localmente com sucesso!", "success");
            
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            fetchAndRenderPosts(activeFilter);
        }
    });

    // Submissão do Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (supabaseClient) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) {
                showToast(`Erro no login: ${error.message}`, "error");
            } else {
                currentUser = {
                    id: data.user.id,
                    name: data.user.user_metadata?.display_name || email.split('@')[0],
                    email: data.user.email,
                    avatarUrl: data.user.user_metadata?.avatar_url || ''
                };
                updateAuthUI();
                closeAuth();
                showToast(`Bem-vindo, ${currentUser.name}!`, "success");
                
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                fetchAndRenderPosts(activeFilter);
            }
        } else {
            // LocalStorage
            let localUsers = JSON.parse(localStorage.getItem('local_users')) || [];
            const user = localUsers.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || '' };
                localStorage.setItem('logged_user', JSON.stringify(currentUser));
                updateAuthUI();
                closeAuth();
                showToast(`Bem-vindo de volta, ${currentUser.name}!`, "success");
                
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                fetchAndRenderPosts(activeFilter);
            } else {
                showToast("Credenciais incorretas ou usuário não encontrado!", "error");
            }
        }
    });

    // Modal de Edição de Perfil
    const profileModal = document.getElementById('profile-modal');
    const closeProfileModal = document.getElementById('close-profile-modal');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editProfileName = document.getElementById('edit-profile-name');
    const editProfileAvatar = document.getElementById('edit-profile-avatar');

    // Mapear clique no botão "Editar Perfil"
    document.addEventListener('click', (e) => {
        if (e.target && (e.target.id === 'btn-edit-profile' || e.target.closest('#header-user-profile'))) {
            if (!currentUser) return;
            editProfileName.value = currentUser.name;
            profileModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });

    const closeProfile = () => {
        profileModal.style.display = 'none';
        document.body.style.overflow = '';
    };

    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', closeProfile);
    }

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const newName = editProfileName.value.trim();
            const newFile = editProfileAvatar.files[0];
            
            let newAvatarUrl = currentUser.avatarUrl;
            if (newFile) {
                newAvatarUrl = await resizeAndCompressImage(newFile);
            }

            currentUser.name = newName;
            currentUser.avatarUrl = newAvatarUrl;

            // Salvar no Supabase
            if (supabaseClient) {
                try {
                    await supabaseClient.auth.updateUser({
                        data: { display_name: newName, avatar_url: newAvatarUrl }
                    });
                } catch (err) {
                    console.error("Erro ao atualizar perfil no Supabase:", err);
                }
            } else {
                // LocalStorage local_users update
                let localUsers = JSON.parse(localStorage.getItem('local_users')) || [];
                const uIndex = localUsers.findIndex(u => u.email === currentUser.email);
                if (uIndex !== -1) {
                    localUsers[uIndex].name = newName;
                    localUsers[uIndex].avatarUrl = newAvatarUrl;
                    localStorage.setItem('local_users', JSON.stringify(localUsers));
                }
            }

            // Atualizar logged_user
            localStorage.setItem('logged_user', JSON.stringify(currentUser));
            
            updateAuthUI();
            closeProfile();
            showToast("Perfil atualizado com sucesso!", "success");

            // Rerenderizar feed para exibir o novo nome/foto do tutor ativo nas postagens
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            fetchAndRenderPosts(activeFilter);
        });
    }

    // Fechar modais clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuth();
        if (e.target === profileModal) closeProfile();
    });

    // ==========================================
    // 5. BANCO DE DADOS DO FÓRUM (HÍBRIDO)
    // ==========================================
    const forumPostsContainer = document.getElementById('forum-posts');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Posts Estáticos Iniciais (como fallback)
    const initialDefaultPosts = [
        {
            id: 'post-default-1',
            author: 'Mariana Santos',
            title: 'Cuidados com as orelhas do Shih Tzu',
            category: 'Dúvidas',
            content: 'Gente, notei que a orelha da minha Shih Tzu está cheirando um pouco forte. Ela vive balançando a cabeça. Será que é otite? Como vcs limpam a orelhinha no dia a dia? Qual produto usam?',
            likes: 4,
            likedUsers: [],
            date: 'Há 1 dia',
            comments: [
                { author: 'Eduardo Reis', text: 'Os pelos internos da orelha do Shih Tzu retêm muita umidade. O ideal é limpar com uma gaze levemente umedecida em loção otológica específica toda semana, e manter as orelhinhas secas após o banho!', time: 'Há 20 horas' }
            ]
        },
        {
            id: 'post-default-2',
            author: 'Dra. Carolina (Vet)',
            title: 'Síndrome do Espirro Reverso em Branquicefálicos',
            category: 'Comportamento',
            content: 'Muitos tutores de Shih Tzu se assustam quando o cão começa a fazer um som de engasgo, puxando o ar com força pelo nariz (o espirro reverso). Isso é comum devido ao palato mole alongado. Uma dica profissional: massageie levemente o pescoço ou tampe as narinas do cão por 2 segundos para fazê-lo engolir saliva, isso acalma o espasmo na hora!',
            likes: 15,
            likedUsers: [],
            date: 'Há 2 dias',
            comments: []
        }
    ];

    // Exibir Skeleton Loaders enquanto os dados carregam
    function renderSkeletons() {
        forumPostsContainer.innerHTML = `
            <div class="skeleton-post">
                <div class="skeleton-header">
                    <div class="skeleton-avatar skeleton-item"></div>
                    <div class="skeleton-meta">
                        <div class="skeleton-name skeleton-item"></div>
                        <div class="skeleton-date skeleton-item"></div>
                    </div>
                </div>
                <div class="skeleton-title skeleton-item"></div>
                <div class="skeleton-text">
                    <div class="skeleton-line skeleton-item"></div>
                    <div class="skeleton-line skeleton-item"></div>
                    <div class="skeleton-line half skeleton-item"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-btn skeleton-item"></div>
                    <div class="skeleton-btn skeleton-item"></div>
                </div>
            </div>
            <div class="skeleton-post">
                <div class="skeleton-header">
                    <div class="skeleton-avatar skeleton-item"></div>
                    <div class="skeleton-meta">
                        <div class="skeleton-name skeleton-item"></div>
                        <div class="skeleton-date skeleton-item"></div>
                    </div>
                </div>
                <div class="skeleton-title skeleton-item"></div>
                <div class="skeleton-text">
                    <div class="skeleton-line skeleton-item"></div>
                    <div class="skeleton-line half skeleton-item"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-btn skeleton-item"></div>
                    <div class="skeleton-btn skeleton-item"></div>
                </div>
            </div>
        `;
    }

    // Carregar posts de forma híbrida com efeito skeleton
    async function fetchAndRenderPosts(filter = 'all') {
        renderSkeletons();
        let posts = [];

        if (supabaseClient) {
            // Buscar do Supabase
            try {
                const { data: dbPosts, error: postError } = await supabaseClient
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (!postError && dbPosts) {
                    // Mapear posts com comentários
                    posts = await Promise.all(dbPosts.map(async (p) => {
                        const { data: dbComments } = await supabaseClient
                            .from('comments')
                            .select('*')
                            .eq('post_id', p.id);
                        
                        return {
                            id: p.id,
                            author: p.author,
                            title: p.title,
                            category: p.category,
                            content: p.content,
                            likes: p.likes || 0,
                            likedUsers: p.liked_users || [],
                            date: new Date(p.created_at).toLocaleDateString('pt-BR'),
                            comments: dbComments ? dbComments.map(c => ({
                                author: c.author,
                                text: c.text,
                                time: new Date(c.created_at).toLocaleDateString('pt-BR')
                            })) : []
                        };
                    }));
                }
            } catch (err) {
                console.error("Falha ao ler posts do Supabase, utilizando fallback local.", err);
            }
            renderPostsList(posts, filter);
        } else {
            // LocalStorage fallback (com atraso artificial para exibir a transição fluida do skeleton)
            setTimeout(() => {
                let localPosts = JSON.parse(localStorage.getItem('forum_posts'));
                if (!localPosts || localPosts.length === 0) {
                    localPosts = initialDefaultPosts;
                    localStorage.setItem('forum_posts', JSON.stringify(localPosts));
                }
                posts = localPosts;
                renderPostsList(posts, filter);
            }, 600);
        }
    }

    // Função auxiliar para gerar um gradiente único baseado no nome
    function getAvatarGradient(name) {
        const gradients = [
            'linear-gradient(135deg, #FF5722, #FFC107)', // Laranja-Amarelo
            'linear-gradient(135deg, #9C27B0, #E91E63)', // Roxo-Rosa
            'linear-gradient(135deg, #00BCD4, #4CAF50)', // Ciano-Verde
            'linear-gradient(135deg, #3F51B5, #00BCD4)', // Índigo-Ciano
            'linear-gradient(135deg, #E91E63, #FFC107)', // Rosa-Amarelo
            'linear-gradient(135deg, #607D8B, #9E9E9E)', // AzulCinza-Cinza
            'linear-gradient(135deg, #FF9800, #FF5722)', // LaranjaEscuro
            'linear-gradient(135deg, #009688, #4CAF50)'  // Teal-Verde
        ];
        
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % gradients.length;
        return gradients[index];
    }

    // Renderização dos cards dos posts
    function renderPostsList(posts, filter) {
        forumPostsContainer.innerHTML = '';
        const filtered = filter === 'all' ? posts : posts.filter(p => p.category === filter);

        if (filtered.length === 0) {
            forumPostsContainer.innerHTML = '<div class="text-center" style="padding: 40px; color: var(--text-light); font-size:0.9rem;">Nenhuma discussão nesta categoria. Faça login e seja o primeiro a publicar! 🐾</div>';
            return;
        }

        // Mais novos primeiro
        const sorted = [...filtered].reverse();

        sorted.forEach(post => {
            const authorParts = post.author.split('|');
            const postAuthorName = authorParts[0];
            const postAuthorAvatar = authorParts[1] || '';
            const postInitial = postAuthorName.charAt(0).toUpperCase();
            
            const hasLiked = currentUser ? post.likedUsers?.includes(currentUser.id) : post.likedUsers?.includes('current');

            let commentsHTML = '';
            post.comments.forEach(c => {
                const commentAuthorParts = c.author.split('|');
                const commentAuthorName = commentAuthorParts[0];
                const commentAuthorAvatar = commentAuthorParts[1] || '';
                const commentInitial = commentAuthorName.charAt(0).toUpperCase();
                
                const commentAvatarHTML = commentAuthorAvatar
                    ? `<img src="${commentAuthorAvatar}" class="author-avatar" alt="${commentAuthorName}" style="width:24px; height:24px; object-fit:cover; border-radius: 50%; flex-shrink:0;">`
                    : `<div class="author-avatar" style="width: 24px; height: 24px; font-size: 0.75rem; background: ${getAvatarGradient(commentAuthorName)}; color: #ffffff; flex-shrink: 0;">${commentInitial}</div>`;
                
                commentsHTML += `
                    <div class="comment-item" style="display: flex; gap: 10px; margin-bottom: 12px; align-items: flex-start;">
                        ${commentAvatarHTML}
                        <div style="flex: 1;">
                            <div class="comment-meta" style="margin-bottom: 2px;">
                                <span class="comment-author" style="font-weight:600; font-size:0.8rem; color: var(--text-primary);">${commentAuthorName}</span>
                                <span class="comment-time" style="font-size:0.7rem; color: var(--text-light); margin-left: 6px;">${c.time}</span>
                            </div>
                            <div class="comment-text" style="font-size:0.8rem; color: var(--text-secondary); line-height: 1.4;">${c.text}</div>
                        </div>
                    </div>
                `;
            });

            const postAvatarHTML = postAuthorAvatar
                ? `<img src="${postAuthorAvatar}" class="author-avatar" alt="${postAuthorName}" style="width:32px; height:32px; object-fit:cover; border-radius: 50%;">`
                : `<div class="author-avatar" style="background: ${getAvatarGradient(postAuthorName)}; color: #ffffff;">${postInitial}</div>`;

            const card = document.createElement('div');
            card.className = 'forum-post-card';
            card.dataset.id = post.id;
            card.innerHTML = `
                <div class="post-header">
                    <div class="post-meta-left">
                        ${postAvatarHTML}
                        <div class="author-info">
                            <span class="author-name">${postAuthorName}</span>
                            <span class="post-date">${post.date}</span>
                        </div>
                    </div>
                    <span class="post-category-tag">${post.category}</span>
                </div>
                <h4>${post.title}</h4>
                <p class="post-text">${post.content}</p>
                <div class="post-actions">
                    <button class="post-act-btn like-btn ${hasLiked ? 'liked' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        <span>Curtir (${post.likes})</span>
                    </button>
                    <button class="post-act-btn comment-toggle-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>Comentários (${post.comments.length})</span>
                    </button>
                </div>
                <div class="post-comments-wrapper" id="comments-${post.id}">
                    <div class="comments-list">
                        ${commentsHTML || '<p class="text-center" style="font-size:0.75rem; color:var(--text-light); padding:10px;">Sem comentários. Adicione um comentário!</p>'}
                    </div>
                    ${currentUser ? `
                    <form class="comment-form" data-postid="${post.id}">
                        <input type="text" class="comment-input" placeholder="Escreva uma resposta..." required>
                        <button type="submit" class="comment-submit-btn" aria-label="Enviar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </form>
                    ` : `
                    <p class="text-center" style="font-size:0.75rem; color:var(--text-light);">Faça login para comentar.</p>
                    `}
                </div>
            `;
            
            forumPostsContainer.appendChild(card);
        });

        bindFeedActions();
    }

    // Configurar curtidas e comentários
    function bindFeedActions() {
        // Curtir Post
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!currentUser) {
                    showToast("Você precisa fazer login para curtir postagens!", "error");
                    openLoginModal();
                    return;
                }

                const card = btn.closest('.forum-post-card');
                const postId = card.dataset.id;
                const userId = currentUser.id;

                // Micro-interação: Coração flutuante instantâneo
                if (!btn.classList.contains('liked')) {
                    createFloatingHeart(e.clientX, e.clientY);
                }

                if (supabaseClient) {
                    try {
                        const { data: post, error } = await supabaseClient.from('posts').select('*').eq('id', postId).single();
                        if (post && !error) {
                            let likesList = post.liked_users || [];
                            let newLikes = post.likes || 0;
                            
                            if (likesList.includes(userId)) {
                                likesList = likesList.filter(id => id !== userId);
                                newLikes = Math.max(0, newLikes - 1);
                            } else {
                                likesList.push(userId);
                                newLikes += 1;
                            }

                            await supabaseClient.from('posts').update({ likes: newLikes, liked_users: likesList }).eq('id', postId);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    let localPosts = JSON.parse(localStorage.getItem('forum_posts')) || [];
                    const post = localPosts.find(p => p.id === postId);
                    if (post) {
                        if (!post.likedUsers) post.likedUsers = [];
                        
                        if (post.likedUsers.includes(userId)) {
                            post.likedUsers = post.likedUsers.filter(id => id !== userId);
                            post.likes = Math.max(0, post.likes - 1);
                        } else {
                            post.likedUsers.push(userId);
                            post.likes += 1;
                        }
                        localStorage.setItem('forum_posts', JSON.stringify(localPosts));
                    }
                }
                
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                fetchAndRenderPosts(activeFilter);
            });
        });

        // Função auxiliar de animação de corações
        function createFloatingHeart(x, y) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart-particle';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            
            const colors = ['#e51c23', '#FF4081', '#A55C4D', '#ff7675'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            heart.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="${randomColor}" stroke="none">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            `;
            
            document.body.appendChild(heart);
            setTimeout(() => {
                heart.remove();
            }, 1000);
        }

        // Toggle Comentários
        document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.forum-post-card');
                const id = card.dataset.id;
                const wrapper = document.getElementById(`comments-${id}`);
                wrapper.style.display = wrapper.style.display === 'block' ? 'none' : 'block';
            });
        });

        // Enviar Comentário
        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const postId = form.getAttribute('data-postid');
                const input = form.querySelector('.comment-input');
                const text = input.value.trim();

                if (text && currentUser) {
                    if (supabaseClient) {
                        try {
                            await supabaseClient.from('comments').insert({
                                post_id: postId,
                                author: currentUser.name + '|' + (currentUser.avatarUrl || ''),
                                text: text
                            });
                        } catch (err) {
                            console.error(err);
                        }
                    } else {
                        // LocalStorage fallback
                        let localPosts = JSON.parse(localStorage.getItem('forum_posts')) || [];
                        const post = localPosts.find(p => p.id === postId);
                        if (post) {
                            post.comments.push({
                                author: currentUser.name + '|' + (currentUser.avatarUrl || ''),
                                text: text,
                                time: 'Agora mesmo'
                            });
                            localStorage.setItem('forum_posts', JSON.stringify(localPosts));
                        }
                    }
                    input.value = '';
                    
                    // Rerenderizar
                    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                    await fetchAndRenderPosts(activeFilter);
                    
                    // Manter aberto o comentário atualizado
                    document.getElementById(`comments-${postId}`).style.display = 'block';
                }
            });
        });
    }

    // Criar nova discussão
    const newPostFormSubmit = document.getElementById('new-post-form');
    newPostFormSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            showToast("Faça login para criar postagens!", "error");
            return;
        }

        const title = document.getElementById('post-title').value.trim();
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value.trim();

        if (title && content) {
            const postId = 'post-' + Date.now();
            const authorName = currentUser.name + '|' + (currentUser.avatarUrl || '');

            if (supabaseClient) {
                try {
                    await supabaseClient.from('posts').insert({
                        id: postId,
                        author: authorName,
                        title: title,
                        category: category,
                        content: content,
                        likes: 0,
                        liked_users: []
                    });
                } catch (err) {
                    showToast("Erro ao criar postagem no servidor: " + err.message, "error");
                }
            } else {
                // LocalStorage Fallback
                let localPosts = JSON.parse(localStorage.getItem('forum_posts')) || [];
                localPosts.push({
                    id: postId,
                    author: authorName,
                    title: title,
                    category: category,
                    content: content,
                    likes: 0,
                    likedUsers: [],
                    date: 'Agora mesmo',
                    comments: []
                });
                localStorage.setItem('forum_posts', JSON.stringify(localPosts));
            }

            newPostFormSubmit.reset();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            await fetchAndRenderPosts(activeFilter);
            document.querySelector('.feed-header').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Filtros de Tópicos
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            fetchAndRenderPosts(filter);
        });
    });

    // ==========================================
    // 6. DONATION PIX WIDGET (COPY PIX KEY)
    // ==========================================
    const btnCopyPix = document.getElementById('btn-copy-pix');
    const pixKeyText = document.getElementById('pix-key-text');
    const copyFeedback = document.getElementById('copy-feedback');

    // Funções auxiliares para gerar o PIX padrão EMV (compatível com aplicativos bancários)
    function fEMV(id, value) {
        const len = String(value.length).padStart(2, '0');
        return id + len + value;
    }

    function calculateCRC16(str) {
        let crc = 0xFFFF;
        for (let i = 0; i < str.length; i++) {
            crc ^= str.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc <<= 1;
                }
            }
        }
        let crcStr = (crc & 0xFFFF).toString(16).toUpperCase();
        return crcStr.padStart(4, '0');
    }

    function getPixEMVString(key, name, city) {
        const payload = 
            fEMV("00", "01") +
            fEMV("26", fEMV("00", "br.gov.bcb.pix") + fEMV("01", key)) +
            fEMV("52", "0000") +
            fEMV("53", "986") +
            fEMV("58", "BR") +
            fEMV("59", name.substring(0, 25)) +
            fEMV("60", city.substring(0, 15)) +
            fEMV("62", fEMV("05", "***")) +
            "6304";
        return payload + calculateCRC16(payload);
    }

    function generatePixQRCode() {
        if (!pixKeyText) return;
        const rawKey = pixKeyText.textContent.trim();
        const pixString = getPixEMVString(rawKey, "Instituto Holly", "Sao Paulo");
        
        if (btnCopyPix) {
            btnCopyPix.dataset.pixstring = pixString;
        }

        // Renderização dinâmica no canvas usando QRIous
        const canvasElement = document.getElementById('pix-qrcode');
        if (canvasElement && window.QRious) {
            // Nível de correção de erro 'H' (High) suporta até 30% de perda de dados,
            // permitindo sobrepor uma imagem central sem inviabilizar a leitura.
            const qr = new window.QRious({
                element: canvasElement,
                value: pixString,
                size: 180,
                background: '#ffffff',
                foreground: '#1F3A2B', // Verde floresta do design
                level: 'H'
            });

            const ctx = canvasElement.getContext('2d');
            const img = new Image();
            img.src = './assets/holly_1.jpg';
            img.onload = () => {
                const size = canvasElement.width;
                const logoSize = size * 0.22; // 22% do tamanho do QR Code (dentro do limite seguro de 30%)
                const logoPos = (size - logoSize) / 2;

                // Desenhar fundo branco com espaçamento para isolar as linhas do QR Code
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(logoPos - 2, logoPos - 2, logoSize + 4, logoSize + 4, 4);
                } else {
                    ctx.rect(logoPos - 2, logoPos - 2, logoSize + 4, logoSize + 4);
                }
                ctx.fill();

                // Desenhar o logotipo da Shih Tzu
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(logoPos, logoPos, logoSize, logoSize, 3);
                    ctx.clip();
                }
                ctx.drawImage(img, logoPos, logoPos, logoSize, logoSize);
                ctx.restore();
            };
        }
    }

    // Gerar no carregamento inicial
    generatePixQRCode();

    if (btnCopyPix) {
        btnCopyPix.addEventListener('click', () => {
            const keyText = btnCopyPix.dataset.pixstring || pixKeyText.textContent;
            navigator.clipboard.writeText(keyText).then(() => {
                copyFeedback.textContent = "Copiado!";
                btnCopyPix.style.color = "#10AC84";
                
                setTimeout(() => {
                    copyFeedback.textContent = "Copiar";
                    btnCopyPix.style.color = "";
                }, 2000);
            }).catch(err => {
                console.error("Falha ao copiar: ", err);
            });
        });
    }

    // ==========================================
    // 7. CHATBOT IA INTELIGENTE (SHIH TZU CARE)
    // ==========================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const suggestionPills = document.querySelectorAll('.suggestion-pill');

    chatToggle.addEventListener('click', () => {
        chatPanel.style.display = chatPanel.style.display === 'flex' ? 'none' : 'flex';
        if (chatPanel.style.display === 'flex') {
            chatInput.focus();
            scrollChatToBottom();
        }
    });

    chatClose.addEventListener('click', () => {
        chatPanel.style.display = 'none';
    });

    suggestionPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const text = pill.getAttribute('data-msg');
            triggerChatResponse(text);
        });
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
            triggerChatResponse(text);
            chatInput.value = '';
        }
    });

    function triggerChatResponse(text) {
        appendMessage('user', text);
        scrollChatToBottom();

        const typingId = appendTypingIndicator();
        scrollChatToBottom();

        const delay = 700 + Math.random() * 800;
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = getAIResponse(text);
            appendMessage('bot', response);
            scrollChatToBottom();
        }, delay);
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatBody.appendChild(messageDiv);
    }

    function appendTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = id;
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatBody.appendChild(typingDiv);
        return id;
    }

    function removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    function scrollChatToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Respostas focadas na Mel e cuidados com Shih Tzu
    function getAIResponse(userInput) {
        const query = userInput.toLowerCase();
        
        const dataset = [
            {
                keys: ['cuidado shih tzu', 'cuidados shih tzu', 'shih tzu', 'pelos', 'olhos shih tzu', 'olho', 'tosar', 'limpeza orelha'],
                response: `<strong>🐶 Cuidados Especiais com Shih Tzus:</strong><br><br>
                O Shih Tzu é um companheiro carinhoso, mas possui fragilidades anatômicas da raça:<br>
                - <strong>Olhos Proeminentes:</strong> São expostos e ressecam fácil. Limpe diariamente com soro fisiológico e gaze estéril. Cuidado com galhos e cantos de móveis para evitar úlceras de córnea.<br>
                - <strong>Pelos e Nós:</strong> Escove diariamente. Nós machucam a pele e acumulam sujeira. Use sprays desemboladores apropriados.<br>
                - <strong>Orelhas Abafadas:</strong> As orelhas caídas acumulam umidade e causam otites frequentes. Limpe com solução otológica semanalmente.<br>
                - <strong>Dermatites:</strong> Secar 100% o pelo após o banho é essencial para evitar fungos e alergias na pele sensível.`
            },
            {
                keys: ['espirro', 'reverso', 'engasgando', 'ar pelo nariz', 'espirro reverso', 'falta de ar'],
                response: `<strong>👃 Espirro Reverso em Shih Tzus:</strong><br><br>
                Devido ao focinho curto (síndrome branquicefálica), Shih Tzus frequentemente sofrem episódios de **espirro reverso**, que parecem um engasgo assustador.<br>
                - <strong>O que fazer:</strong> Mantenha a calma. Massageie levemente a garganta do animal ou tampe as narinas com os dedos por 2 segundos para forçá-lo a engolir. Isso interrompe o espasmo do palato mole imediatamente.<br><br>
                <em>Se o cão apresentar gengivas roxas ou desmaiar, leve-o ao veterinário imediatamente!</em>`
            },
            {
                keys: ['alimento', 'proibido', 'veneno', 'tóxico', 'comer', 'chocolate', 'uva', 'cebola', 'alho', 'abacate'],
                response: `<strong>🚫 Alimentos Perigosos para Cães:</strong><br><br>
                1. <strong>Chocolate:</strong> Teobromina acelera o coração canino, podendo causar parada cardíaca.<br>
                2. <strong>Uvas/Uvas-Passas:</strong> Causam falência renal aguda. Não dê nenhuma unidade.<br>
                3. <strong>Cebola e Alho:</strong> Contêm dissulfeto de n-propila, destruindo glóbulos vermelhos (anemia).<br>
                4. <strong>Xilitol (Adoçante):</strong> Causa hipoglicemia severa e danos no fígado.<br><br>
                <em>Em caso de ingestão acidental, procure uma clínica de pronto atendimento.</em>`
            },
            {
                keys: ['dor', 'sintoma', 'triste', 'doente', 'chorando', 'febre', 'mancar', 'gemendo'],
                response: `<strong>🤒 Sinais de Dor Canina:</strong><br><br>
                Cães camuflam sintomas por instinto. Observe:<br>
                - Postura curvada ou cauda baixa.<br>
                - Arquejamento rápido mesmo em repouso.<br>
                - Recusa de alimentos favoritos.<br>
                - Reação agressiva ou fuga ao ser tocado.<br><br>
                <strong>Importante:</strong> Nunca ofereça analgésicos humanos (Paracetamol e Ibuprofeno são veneno para pets).`
            },
            {
                keys: ['vacina', 'filhote', 'calendário', 'v8', 'v10', 'antirrábica', 'raiva', 'imunidade'],
                response: `<strong>💉 Vacinas Recomendadas:</strong><br><br>
                - <strong>45 dias de vida:</strong> 1ª dose da vacina múltipla (V8 ou V10).<br>
                - <strong>Repetições:</strong> Mais 2 doses a cada 25-30 dias.<br>
                - <strong>4 meses:</strong> Vacina Antirrábica (Raiva).<br>
                - <strong>Reforço:</strong> V8/V10 e Antirrábica devem ser repetidas anualmente em dose única.`
            },
            {
                keys: ['quem é holly', 'sobre a holly', 'história da holly', 'por que o site', 'mascote'],
                response: `🐾 <strong>Legado da Holly:</strong><br><br>
                A Holly era uma doce Shih Tzu caramelo e branca que trouxe alegria imensa a seus tutores. Quando ela virou estrelinha, seus tutores fundaram o Instituto Holly para disseminar guias de saúde, conscientizar sobre a causa animal e amparar tutores.<br><br>
                Ela é a nossa estrela-guia e o rostinho estampado em nosso portal! ✨`
            },
            {
                keys: ['luto', 'saudade', 'perdi', 'faleceu', 'morreu', 'virou estrela', 'estrelinha', 'despedida', 'tristeza', 'dor da perda', 'coração partido'],
                response: `❤️ <strong>Acolhendo o seu Coração: Suporte ao Luto de Pets</strong><br><br>
                Sinto muito pela sua perda. A dor de ver um companheiro de quatro patas partir é real, legítima e profundamente dolorosa. Eles são membros da nossa família e nos oferecem um amor puro e sem julgamentos.<br><br>
                <strong>Para ajudar a confortar sua dor:</strong><br>
                - <strong>Valide seus sentimentos:</strong> Chore, sinta e não deixe que ninguém diminua a sua dor dizendo que "era só um animal". O vínculo que vocês tinham era sagrado.<br>
                - <strong>Respire com calma:</strong> Se o peito apertar, inspire pelo nariz contando até 4, segure por 4 e expire lentamente pela boca contando até 4. Repita três vezes.<br>
                - <strong>Ressignifique com amor:</strong> O amor deles não acaba com a partida física; ele se transforma nas memórias felizes. Que tal acender uma vela virtual com uma dedicatória em nosso <strong>Mural de Estrelinhas</strong> (no menu da História de Holly) para eternizar seu legado?<br><br>
                <em>Estamos aqui para te acolher. Você não está sozinho nessa caminhada. 🌟🐾</em>`
            },
            {
                keys: ['ola', 'olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'ajuda'],
                response: `Olá! Sou a assistente virtual Holly 🐶. Como posso ajudar com a saúde ou cuidados do seu cão hoje?<br><br>
                Pergunte sobre <strong>"cuidados Shih Tzu"</strong>, <strong>"alimentos proibidos"</strong> ou <strong>"espirro reverso"</strong>.`
            }
        ];

        for (const item of dataset) {
            const matches = item.keys.some(key => query.includes(key));
            if (matches) return item.response;
        }

        return `Compreendo. Sou uma IA programada para orientações de saúde pet. 🐾<br><br>
        Tente pesquisar por termos diretos como <strong>"cuidados Shih Tzu"</strong>, <strong>"sinais de dor"</strong>, <strong>"vacinas"</strong> ou <strong>"alimentos tóxicos"</strong>.<br><br>
        <em>Atenção: IAs não substituem o diagnóstico presencial de um médico veterinário qualificado!</em>`;
    }

    // ==========================================
    // 8. CONTACT FORM & NEWSLETTER MOCK SUBMIT
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-send-contact');
            const original = btn.textContent;
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Mensagem Enviada!';
                btn.style.backgroundColor = '#10AC84';
                contactForm.reset();
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-newsletter');
            const original = btn.textContent;
            btn.textContent = 'Inscrito!';
            btn.style.backgroundColor = '#10AC84';
            newsletterForm.reset();
            setTimeout(() => {
                btn.textContent = original;
                btn.style.backgroundColor = '';
            }, 2000);
        });
    }

    // ==========================================
    // 9. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        visibleEntries.forEach((entry, index) => {
            const element = entry.target;
            // Efeito cascata (staggered delay) de 80ms para elementos que surgem juntos
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 80);
            observer.unobserve(element);
        });
    }, {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    document.querySelectorAll('.reveal-item').forEach(item => {
        revealObserver.observe(item);
    });

    // ==========================================
    // 10. INTERACTIVE 3D TILT EFFECT (GPU DAMPED)
    // ==========================================
    const tiltCards = document.querySelectorAll('.care-card, .news-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const w = rect.width;
            const h = rect.height;
            
            // Ângulo máximo de inclinação de 7 graus
            const rotateX = ((y / h) - 0.5) * -7;
            const rotateY = ((x / w) - 0.5) * 7;
            
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==========================================
    // 11. INTERACTIVE HERO TIMELINE TABS (HOLLY)
    // ==========================================
    const timelineTabs = document.querySelectorAll('.timeline-tab-btn');
    const timelineMainImg = document.getElementById('timeline-main-img');
    const timelinePhaseTitle = document.getElementById('timeline-phase-title');
    const timelinePhaseDesc = document.getElementById('timeline-phase-desc');

    if (timelineTabs && timelineMainImg) {
        timelineTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                timelineTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Cross-fade animation triggers
                timelineMainImg.classList.add('fade-out');

                setTimeout(() => {
                    timelineMainImg.src = btn.dataset.img;
                    timelineMainImg.alt = btn.dataset.title;
                    timelinePhaseTitle.textContent = btn.dataset.title;
                    timelinePhaseDesc.textContent = btn.dataset.desc;

                    timelineMainImg.classList.remove('fade-out');
                }, 400);
            });
        });
    }

    // ==========================================
    // 12. INTERACTIVE MEMORIAL CANDLE & TRIBUTE WALL
    // ==========================================
    const btnLightCandle = document.getElementById('btn-light-candle');
    const candleFlame = document.getElementById('candle-flame');
    const candleCountVal = document.getElementById('candle-count-val');
    const tributeFormContainer = document.getElementById('tribute-form-container');
    const tributeForm = document.getElementById('tribute-form');
    const tributeCardsList = document.getElementById('tribute-cards-list');
    const candleAmbientGlow = document.getElementById('candle-ambient-glow');

    let particleInterval = null;

    function startAmbientGlow() {
        if (!candleAmbientGlow) return;
        if (particleInterval) clearInterval(particleInterval);
        
        candleAmbientGlow.innerHTML = '';
        
        particleInterval = setInterval(() => {
            const particle = document.createElement('span');
            particle.className = 'glow-particle';
            
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.bottom = `10px`;
            particle.style.animationDelay = `${delay}s`;
            
            candleAmbientGlow.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 4000);
        }, 400);
    }

    function renderTributeCards() {
        // Obter as dedicatórias do localStorage (ou defaults)
        let tributes = JSON.parse(localStorage.getItem('memorial_tributes'));
        if (!tributes || tributes.length === 0) {
            tributes = [
                { pet: "Holly", tutor: "Família Holly", message: "Sua doçura e seus lacinhos coloridos iluminaram nossa vida. Para sempre nossa rainha.", date: "03/07/2026" },
                { pet: "Bob", tutor: "Ana Souza", message: "Sentimos sua falta correndo pela casa e pulando no edredom todos os dias.", date: "02/07/2026" },
                { pet: "Mel", tutor: "Eduardo Reis", message: "Obrigado por 14 anos de puro amor incondicional e companhia nas noites frias.", date: "29/06/2026" }
            ];
            localStorage.setItem('memorial_tributes', JSON.stringify(tributes));
        }

        const sortedTributes = [...tributes].reverse();
        
        // Renderizar no modal se o elemento estiver presente
        if (tributeCardsList) {
            tributeCardsList.innerHTML = sortedTributes.map(t => `
                <div class="tribute-card">
                    <div class="tribute-card-header">
                        <span class="tribute-pet">✨ ${t.pet}</span>
                        <span class="tribute-tutor">Por ${t.tutor} • ${t.date}</span>
                    </div>
                    <div class="tribute-desc">"${t.message}"</div>
                </div>
            `).join('');
        }

        // Renderizar no destaque da página inicial (Mural Rápido)
        const homeTributesList = document.getElementById('home-tributes-list');
        const homeCandleCount = document.getElementById('home-candle-count');
        if (homeCandleCount) {
            const candleCount = parseInt(localStorage.getItem('holly_candles') || '1240');
            homeCandleCount.textContent = candleCount.toLocaleString('pt-BR');
        }
        if (homeTributesList) {
            const latestThree = sortedTributes.slice(0, 3);
            homeTributesList.innerHTML = latestThree.map(t => `
                <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 0.8rem; box-shadow: var(--shadow-sm); animation: fade-in-slide-up 0.4s ease forwards;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <strong style="color: var(--primary);">✨ ${t.pet}</strong>
                        <span style="font-size: 0.7rem; color: var(--text-light);">Por ${t.tutor}</span>
                    </div>
                    <div style="font-style: italic; color: var(--text-secondary); font-size: 0.75rem;">"${t.message}"</div>
                </div>
            `).join('');
        }
    }

    if (btnLightCandle && candleFlame && candleCountVal) {
        let candleCount = parseInt(localStorage.getItem('holly_candles') || '1240');
        candleCountVal.textContent = candleCount.toLocaleString('pt-BR');
        
        renderTributeCards();

        if (sessionStorage.getItem('candle_lit') === 'true') {
            candleFlame.classList.add('active');
            if (candleFlame.parentElement) {
                candleFlame.parentElement.classList.add('active');
            }
            btnLightCandle.disabled = true;
            btnLightCandle.textContent = 'Sua Homenagem está Acesa';
            btnLightCandle.style.backgroundColor = '#10AC84';
            btnLightCandle.style.borderColor = '#10AC84';
            btnLightCandle.style.color = '#ffffff';
            if (tributeFormContainer) tributeFormContainer.style.display = 'none';
            startAmbientGlow();
        }

        btnLightCandle.addEventListener('click', () => {
            if (sessionStorage.getItem('candle_lit') === 'true') return;
            
            if (tributeFormContainer) {
                tributeFormContainer.style.display = tributeFormContainer.style.display === 'block' ? 'none' : 'block';
                if (tributeFormContainer.style.display === 'block') {
                    const petInput = document.getElementById('tribute-pet-name');
                    if (petInput) petInput.focus();
                    tributeFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });

        if (tributeForm) {
            tributeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (sessionStorage.getItem('candle_lit') === 'true') return;

                const petName = document.getElementById('tribute-pet-name').value.trim();
                const tutorName = document.getElementById('tribute-tutor-name').value.trim() || "Tutor Anônimo";
                const messageText = document.getElementById('tribute-message').value.trim();

                if (petName && messageText) {
                    let tributes = JSON.parse(localStorage.getItem('memorial_tributes')) || [];
                    const newTribute = {
                        pet: petName,
                        tutor: tutorName,
                        message: messageText,
                        date: new Date().toLocaleDateString('pt-BR')
                    };
                    tributes.push(newTribute);
                    localStorage.setItem('memorial_tributes', JSON.stringify(tributes));

                    candleFlame.classList.add('active');
                    if (candleFlame.parentElement) {
                        candleFlame.parentElement.classList.add('active');
                    }
                    
                    candleCount += 1;
                    localStorage.setItem('holly_candles', candleCount.toString());
                    candleCountVal.textContent = candleCount.toLocaleString('pt-BR');

                    sessionStorage.setItem('candle_lit', 'true');

                    btnLightCandle.disabled = true;
                    btnLightCandle.textContent = 'Homenagem Enviada! ✨';
                    btnLightCandle.style.backgroundColor = '#10AC84';
                    btnLightCandle.style.borderColor = '#10AC84';
                    btnLightCandle.style.color = '#ffffff';
                    
                    tributeFormContainer.style.display = 'none';
                    tributeForm.reset();

                    renderTributeCards();
                    startAmbientGlow();
                    
                    showToast("Homenagem enviada! Sua estrelinha agora brilha em nosso memorial.", "success");
                }
            });
        }
    }

    // ==========================================
    // 13. DOG-TO-HUMAN AGE CALCULATOR (SHIH TZU)
    // ==========================================
    const dogAgeInput = document.getElementById('dog-age-input');
    const humanAgeVal = document.getElementById('human-age-val');
    const calcPhaseBadge = document.getElementById('calc-phase-badge');
    const calcAdviceText = document.getElementById('calc-advice-text');

    if (dogAgeInput && humanAgeVal && calcPhaseBadge && calcAdviceText) {
        const calculateAge = () => {
            const dogAge = Math.max(1, Math.min(25, parseInt(dogAgeInput.value) || 0));
            let humanAge = 0;

            if (dogAge === 1) humanAge = 15;
            else if (dogAge === 2) humanAge = 24;
            else humanAge = 24 + (dogAge - 2) * 4;

            humanAgeVal.textContent = humanAge;

            if (dogAge <= 1) {
                calcPhaseBadge.textContent = "Filhote";
                calcPhaseBadge.style.backgroundColor = "#54a0ff";
                calcAdviceText.textContent = "Fase crucial de socialização, vacinas primárias e ração especial para filhotes de raças pequenas. Limite pulos altos para proteger a coluna.";
            } else if (dogAge <= 6) {
                calcPhaseBadge.textContent = "Adulto";
                calcPhaseBadge.style.backgroundColor = "#10ac84";
                calcAdviceText.textContent = "Seu cão está no auge físico. Mantenha rotina de escovação dentária (raça propensa a tártaro) e caminhadas diárias para controle de peso.";
            } else if (dogAge <= 10) {
                calcPhaseBadge.textContent = "Maduro / Sênior Inicial";
                calcPhaseBadge.style.backgroundColor = "#ff9f43";
                calcAdviceText.textContent = "Início da maturidade. Faça check-ups oftalmológicos regulares (olhos saltados são propensos a úlcera de córnea) e comece suplementação de condroitina.";
            } else {
                calcPhaseBadge.textContent = "Geriatra / Sênior Avançado";
                calcPhaseBadge.style.backgroundColor = "#ee5253";
                calcAdviceText.textContent = "Fase de realeza e muitos cuidados. Adaptar a casa com rampas, tapetes antiderrapantes e oferecer alimentação macia. Check-ups semestrais são vitais.";
            }
        };

        dogAgeInput.addEventListener('input', calculateAge);
        dogAgeInput.addEventListener('change', calculateAge);
    }

    // ==========================================
    // 14. LIGHTBOX IMAGE GALLERY (HOLLY)
    // ==========================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const galleryItems = Array.from(document.querySelectorAll('.timeline-thumb, .timeline-active-img'));
    let currentGalleryIndex = 0;

    if (lightboxModal && lightboxImg && lightboxCaption) {
        const openLightbox = (index) => {
            currentGalleryIndex = index;
            const item = galleryItems[index];
            
            lightboxImg.src = item.src;
            lightboxCaption.textContent = item.alt || "Homenagem à Holly";
            
            lightboxModal.style.display = 'flex';
            setTimeout(() => {
                lightboxModal.classList.add('active');
            }, 10);
        };

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            setTimeout(() => {
                lightboxModal.style.display = 'none';
            }, 300);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        const showNext = () => {
            let nextIndex = (currentGalleryIndex + 1) % galleryItems.length;
            while (!galleryItems[nextIndex].src && nextIndex !== currentGalleryIndex) {
                nextIndex = (nextIndex + 1) % galleryItems.length;
            }
            openLightbox(nextIndex);
        };

        const showPrev = () => {
            let prevIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
            while (!galleryItems[prevIndex].src && prevIndex !== currentGalleryIndex) {
                prevIndex = (prevIndex - 1 + galleryItems.length) % galleryItems.length;
            }
            openLightbox(prevIndex);
        };

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });

        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }

    // Sistema Global de Notificações Toast
    function showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = '🔔';
        
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ==========================================
    // 14. TRILHA SONORA CELESTIAL DE ACOLHIMENTO (YOUTUBE API PLAYER)
    // ==========================================
    let ytPlayer = null;
    let isPlayingSoundtrack = false;
    let ytApiLoaded = false;

    // Carregar a API do YouTube dinamicamente sob demanda
    function loadYoutubeAPI() {
        if (ytApiLoaded) return;
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        ytApiLoaded = true;
    }

    // Callback global exigido pelo iframe player do YouTube
    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-audio-container', {
            height: '0',
            width: '0',
            videoId: '2Ad8xhdSs4Q',
            playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: '2Ad8xhdSs4Q', // Necessário para looping contínuo de um vídeo único
                playsinline: 1
            },
            events: {
                onReady: (event) => {
                    event.target.setVolume(20); // Volume suave de fundo (20%)
                    event.target.playVideo();
                    isPlayingSoundtrack = true;
                    updateSoundtrackButtonUI(true);
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        event.target.playVideo();
                    }
                }
            }
        });
    };

    function updateSoundtrackButtonUI(active) {
        const soundtrackToggle = document.getElementById('soundtrack-toggle');
        if (!soundtrackToggle) return;
        
        if (active) {
            soundtrackToggle.style.color = '#ffffff';
            soundtrackToggle.style.borderColor = 'var(--primary)';
            soundtrackToggle.style.backgroundColor = 'var(--primary)';
            soundtrackToggle.querySelector('.music-icon').style.transform = 'rotate(360deg)';
            soundtrackToggle.title = "Pausar música";
        } else {
            soundtrackToggle.style.color = 'var(--text-secondary)';
            soundtrackToggle.style.borderColor = 'var(--border-color)';
            soundtrackToggle.style.backgroundColor = 'var(--bg-secondary)';
            soundtrackToggle.querySelector('.music-icon').style.transform = 'none';
            soundtrackToggle.title = "Ativar música de acolhimento";
        }
    }

    const soundtrackToggle = document.getElementById('soundtrack-toggle');
    if (soundtrackToggle) {
        soundtrackToggle.addEventListener('click', () => {
            if (!ytPlayer) {
                showToast("Carregando música de acolhimento...", "info");
                loadYoutubeAPI();
            } else {
                if (isPlayingSoundtrack) {
                    ytPlayer.pauseVideo();
                    isPlayingSoundtrack = false;
                    updateSoundtrackButtonUI(false);
                    showToast("Trilha sonora pausada.", "info");
                } else {
                    ytPlayer.playVideo();
                    isPlayingSoundtrack = true;
                    updateSoundtrackButtonUI(true);
                    showToast("Tocando trilha sonora de luto e saudade...", "info");
                }
            }
        });
    }

    // Inicialização da verificação de login ao carregar a página
    checkAuth().then(() => {
        // Carregar posts iniciais
        fetchAndRenderPosts('all');
    });
});
