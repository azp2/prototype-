'use strict';
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = $('.menu'), links = $('#links');
menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة'); });
$$('a', links).forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
let toastTimer;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 6500); }
function whatsappURL(message) {
  const number = String(window.SITE_CONFIG?.whatsappNumber || '').replace(/[\s+()-]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
}
function openWhatsApp(message) {
  const url = whatsappURL(message);
  if (!url) { toast('سيُفعّل التواصل المباشر فور إضافة رقم واتساب الشركة.'); return false; }
  // Open a draft only. The visitor reviews and sends in WhatsApp.
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
const greeting = 'السلام عليكم، أرغب بالتواصل مع المنصور للاستشارات الهندسية بخصوص مشروع جديد.';
$$('[data-whatsapp]').forEach(button => button.addEventListener('click', () => openWhatsApp(greeting)));
const descriptions = {
 'التصميم': 'من الفكرة الأولى إلى المخططات: تطوير التصور المعماري وتوزيع المساحات، وإعداد المخططات المعمارية والإنشائية وتنسيق التخصصات. يتم تحديد المخرجات وفق نوع المشروع واحتياجاتك.',
 'الإشراف': 'متابعة ميدانية وفق نطاق الاتفاق، ومراجعة مطابقة التنفيذ للمخططات، ومتابعة الملاحظات الفنية وتوثيق مراحل العمل بتقارير واضحة.',
 'المساحة': 'الرفع المساحي للموقع، وتحديد الحدود والمناسيب، وتوقيع المحاور وإعداد المخططات المساحية التي تساعد على اتخاذ قرارات التصميم والتنفيذ.',
 'الدفاع المدني': 'إعداد مخططات أنظمة الإنذار والإطفاء ومسارات الإخلاء، ومراجعة احتياجات السلامة. تحدد متطلبات كل مشروع بحسب استخدامه ونطاق العمل.'
};
const modal = $('#details');
$$('[data-service]').forEach(button => {
 const name = button.dataset.service;
 button.addEventListener('click', () => { $('#detail-title').textContent = name; $('#detail-text').textContent = descriptions[name]; modal.showModal(); });
 const quick = document.createElement('button'); quick.className = 'quick-request'; quick.type = 'button'; quick.innerHTML = 'اطلب الخدمة عبر واتساب <span>↗</span>';
 quick.setAttribute('aria-label', 'طلب خدمة ' + name + ' عبر واتساب');
 quick.addEventListener('click', () => openWhatsApp('السلام عليكم، أرغب بطلب خدمة ' + name + ' من المنصور للاستشارات الهندسية. أود مناقشة تفاصيل المشروع.'));
 button.after(quick);
});
$('#choose').addEventListener('click', () => { $('#service').value = $('#detail-title').textContent; modal.close(); $('#contact').scrollIntoView({behavior: reducedMotion ? 'instant' : 'smooth'}); });
$('#service-whatsapp').addEventListener('click', () => openWhatsApp('السلام عليكم، أرغب بطلب خدمة ' + $('#detail-title').textContent + ' من المنصور للاستشارات الهندسية.'));
$$('dialog').forEach(dialog => { $('.close', dialog).addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); }); });
$('#form').addEventListener('submit', e => {
 e.preventDefault(); const data = new FormData(e.target);
 const message = ['السلام عليكم، أرغب بطلب خدمة من المنصور للاستشارات الهندسية.', '', 'الاسم: ' + data.get('name'), 'الجوال: ' + data.get('phone'), 'الخدمة: ' + data.get('service'), 'نوع المشروع: ' + data.get('projectType'), 'المدينة: ' + data.get('city'), '', 'تفاصيل المشروع:', data.get('message')].join('\n');
 const opened = openWhatsApp(message);
 $('#status').textContent = opened ? 'تم طلب فتح واتساب برسالة جاهزة. راجع التفاصيل وأرسلها من واتساب.' : 'بانتظار إضافة رقم واتساب الشركة لتفعيل الطلبات المباشرة.';
});
const projectData = [
 { title: 'سكن يعكس أسلوب الحياة', text: 'تصور سكني يوازن بين الخصوصية والانفتاح. خطوط واضحة، خامات هادئة، وعلاقة مدروسة بين المساحات الداخلية والفناء. مثال توضيحي للاتجاه المعماري، وليس مشروعًا منفذًا للشركة.' },
 { title: 'بيئة عمل تفتح الآفاق', text: 'تصور لمساحة عمل تستفيد من الإضاءة الطبيعية وتنوع مناطق الاستخدام. يجمع بين المساحات المشتركة والزوايا الهادئة لتلبية احتياجات يوم العمل. مثال توضيحي، وليس مشروعًا منفذًا للشركة.' }
];
$$('.project-open').forEach(button => button.addEventListener('click', () => {
 const card = button.closest('[data-project]'); const project = projectData[Number(card.dataset.project)];
 $('#project-title').textContent = project.title; $('#project-description').textContent = project.text;
 $('#project-image').src = $('img', card).src; $('#project-image').alt = $('img', card).alt;
 $('#project-dialog').showModal();
}));
$('#project-contact').addEventListener('click', () => $('#project-dialog').close());
// Progressive enhancement: all content remains visible if JS or motion is unavailable.
const revealTargets = $$('.top > div, .heroimg, .heading, .service, .value-grid article, .project, .process > div, .faq-section > div, .contactgrid > div, .contactgrid form');
if (!reducedMotion && 'IntersectionObserver' in window) {
 const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; entry.target.classList.remove('pending'); entry.target.classList.add('ready'); if (entry.target.classList.contains('heroimg')) entry.target.classList.add('drawing'); reveal.unobserve(entry.target); }), {threshold: .1});
 revealTargets.forEach((el, i) => { el.classList.add('motion', 'pending'); el.style.setProperty('--delay', (el.matches('.service, .value-grid article') ? (i % 4) * 75 : 0) + 'ms'); reveal.observe(el); });
} else $('.heroimg').classList.add('drawing');
if ('IntersectionObserver' in window) {
 const activeSections = new Map();
 const navObserver = new IntersectionObserver(entries => { entries.forEach(entry => activeSections.set(entry.target.id, entry.isIntersecting)); const active = [...activeSections].find(([,visible]) => visible)?.[0]; $$('.links a').forEach(a => { const selected = a.hash === '#' + active; a.classList.toggle('active', selected); if (selected) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); }, {rootMargin:'-15% 0px -45% 0px',threshold:0});
 $$('#about, #services, #projects, #process').forEach(el => navObserver.observe(el));
 const stepObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('current',entry.isIntersecting)),{rootMargin:'-25% 0px -35% 0px',threshold:.6});
 $$('.step').forEach(el => stepObserver.observe(el));
}
let ticking = false;
function paintScroll() {
 const y = window.scrollY; const extent = document.documentElement.scrollHeight - window.innerHeight;
 $('.scroll-progress').style.transform = 'scaleX(' + (extent > 0 ? y / extent : 0) + ')';
 $('header').classList.toggle('scrolled', y > 35);
 if (!reducedMotion && window.matchMedia('(min-width: 801px)').matches) $('.heroimg > img').style.transform = 'translateY(' + Math.min(y * .08, 38) + 'px) scale(1.12)';
 ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paintScroll); } }, {passive:true});
window.addEventListener('resize',paintScroll); paintScroll();
if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) $$('.service').forEach(card => card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', (e.clientX-r.left)+'px'); card.style.setProperty('--my', (e.clientY-r.top)+'px'); }));
