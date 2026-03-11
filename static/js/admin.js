(function() {
    var catalogList = document.getElementById('catalogList');
    var btnAddObject = document.getElementById('btnAddObject');
    var objectModal = document.getElementById('objectModal');
    var objectModalTitle = document.getElementById('objectModalTitle');
    var objectModalClose = document.getElementById('objectModalClose');
    var objectModalCancel = document.getElementById('objectModalCancel');
    var objectForm = document.getElementById('objectForm');
    var objectId = document.getElementById('objectId');
    var objectTitle = document.getElementById('objectTitle');
    var objectCount = document.getElementById('objectCount');
    var objectIcon = document.getElementById('objectIcon');
    var objectDescription = document.getElementById('objectDescription');
    var objectImages = document.getElementById('objectImages');
    var adminLogout = document.getElementById('adminLogout');

    function api(path, options) {
        options = options || {};
        var url = '/api/admin' + path;
        return fetch(url, {
            method: options.method || 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: options.body ? JSON.stringify(options.body) : undefined
        }).then(function(r) {
            if (r.status === 401) {
                window.location.href = '/';
                return Promise.reject(new Error('Unauthorized'));
            }
            return r.json().then(function(data) {
                if (r.ok) return data;
                return Promise.reject(new Error(data.error || 'Error'));
            });
        });
    }

    function loadCatalog() {
        return api('/catalog').then(function(items) {
            renderCatalog(items);
            return items;
        });
    }

    function renderCatalog(items) {
        if (!items || items.length === 0) {
            catalogList.innerHTML = '<div class="admin-empty">Объектов пока нет. Нажмите «Добавить объект».</div>';
            return;
        }
        catalogList.innerHTML = items.map(function(item) {
            var thumb = (item.images && item.images[0]) ? item.images[0] : '';
            return (
                '<div class="admin-catalog-item" data-id="' + item.id + '">' +
                (thumb ? '<img class="admin-catalog-item-thumb" src="' + thumb + '" alt="">' : '') +
                '<div class="admin-catalog-item-body">' +
                '<div class="admin-catalog-item-title">' + escapeHtml(item.title) + '</div>' +
                '<div class="admin-catalog-item-meta">' + escapeHtml(item.count) + '</div>' +
                '</div>' +
                '<div class="admin-catalog-item-actions">' +
                '<button type="button" class="admin-btn admin-btn-outline btn-edit">Изменить</button>' +
                '<button type="button" class="admin-btn admin-btn-danger btn-delete">Удалить</button>' +
                '</div></div>'
            );
        }).join('');

        catalogList.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.closest('.admin-catalog-item').getAttribute('data-id'), 10);
                openEditModal(id);
            });
        });
        catalogList.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.closest('.admin-catalog-item').getAttribute('data-id'), 10);
                if (confirm('Удалить этот объект из каталога?')) deleteItem(id);
            });
        });
    }

    function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function openAddModal() {
        objectModalTitle.textContent = 'Добавить объект';
        objectId.value = '';
        objectTitle.value = '';
        objectCount.value = '';
        objectIcon.value = '';
        objectDescription.value = '';
        objectImages.value = '';
        objectModal.classList.add('active');
    }

    function openEditModal(id) {
        api('/catalog').then(function(items) {
            var item = items.find(function(i) { return i.id === id; });
            if (!item) return;
            objectModalTitle.textContent = 'Редактировать объект';
            objectId.value = item.id;
            objectTitle.value = item.title || '';
            objectCount.value = item.count || '';
            objectIcon.value = item.icon || '';
            objectDescription.value = item.description || '';
            objectImages.value = (item.images || []).join('\n');
            objectModal.classList.add('active');
        });
    }

    function closeModal() {
        objectModal.classList.remove('active');
    }

    function deleteItem(id) {
        api('/catalog/' + id, { method: 'DELETE' }).then(function() {
            loadCatalog();
        }).catch(function(err) {
            alert('Ошибка: ' + err.message);
        });
    }

    var objectImagesUpload = document.getElementById('objectImagesUpload');
    var btnUploadImages = document.getElementById('btnUploadImages');

    function triggerImageUpload() {
        if (objectImagesUpload) objectImagesUpload.click();
    }

    function onImageFilesSelected() {
        var files = objectImagesUpload && objectImagesUpload.files;
        if (!files || files.length === 0) return;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) formData.append('files', files[i]);
        if (btnUploadImages) {
            btnUploadImages.disabled = true;
            btnUploadImages.textContent = 'Загрузка…';
        }
        fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        }).then(function(r) {
            if (!r.ok) return r.json().then(function(d) { throw new Error(d.error || 'Ошибка загрузки'); });
            return r.json();
        }).then(function(data) {
            var urls = (data.urls || []).filter(Boolean);
            if (urls.length) {
                var cur = objectImages.value.trim();
                var add = urls.join('\n');
                objectImages.value = cur ? cur + '\n' + add : add;
            }
        }).catch(function(err) {
            alert('Ошибка загрузки: ' + err.message);
        }).then(function() {
            if (btnUploadImages) {
                btnUploadImages.disabled = false;
                btnUploadImages.textContent = 'Загрузить фото';
            }
            objectImagesUpload.value = '';
        });
    }

    if (btnUploadImages) btnUploadImages.addEventListener('click', triggerImageUpload);
    if (objectImagesUpload) objectImagesUpload.addEventListener('change', onImageFilesSelected);

    objectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var id = objectId.value ? parseInt(objectId.value, 10) : null;
        var imagesText = objectImages.value.trim();
        var images = imagesText ? imagesText.split(/\n/).map(function(s) { return s.trim(); }).filter(Boolean) : [];
        var payload = {
            title: objectTitle.value.trim(),
            count: objectCount.value.trim(),
            icon: objectIcon.value.trim() || '📋',
            description: objectDescription.value.trim(),
            images: images
        };
        var promise = id !== null && id !== ''
            ? api('/catalog/' + id, { method: 'PUT', body: payload })
            : api('/catalog', { method: 'POST', body: payload });
        promise.then(function() {
            closeModal();
            loadCatalog();
        }).catch(function(err) {
            alert('Ошибка: ' + err.message);
        });
    });

    btnAddObject.addEventListener('click', openAddModal);
    objectModalClose.addEventListener('click', closeModal);
    objectModalCancel.addEventListener('click', closeModal);
    objectModal.addEventListener('click', function(e) {
        if (e.target === objectModal) closeModal();
    });

    adminLogout.addEventListener('click', function() {
        fetch('/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(function() { window.location.href = '/'; });
    });

    loadCatalog();

    // --- Тексты сайта ---
    var textsModal = document.getElementById('textsModal');
    var textsForm = document.getElementById('textsForm');
    var btnEditTexts = document.getElementById('btnEditTexts');
    var textsModalClose = document.getElementById('textsModalClose');
    var textsModalCancel = document.getElementById('textsModalCancel');

    function openTextsModal() {
        api('/site-content').then(function(content) {
            content = content || {};
            var h = content.hero || {};
            var a = content.about || {};
            var p = content.projects || {};
            var pr = content.process || {};
            var c = content.contacts || {};
            var f = content.footer || {};

            document.getElementById('t_hero_title').value = h.title || '';
            document.getElementById('t_hero_desc').value = h.desc || '';
            document.getElementById('t_hero_btn_primary').value = h.btn_primary || '';
            document.getElementById('t_hero_btn_secondary').value = h.btn_secondary || '';

            document.getElementById('t_about_heading').value = a.heading || '';
            document.getElementById('t_about_p1').value = a.p1 || '';
            document.getElementById('t_about_p2').value = a.p2 || '';
            document.getElementById('t_about_partners_title').value = a.partners_title || '';
            document.getElementById('t_about_partners').value = (a.partners || []).map(function(item) {
                if (item && typeof item === 'object' && item.type === 'image' && item.src) return 'img: ' + item.src;
                if (item && typeof item === 'object' && item.name) return item.name;
                return typeof item === 'string' ? item : '';
            }).filter(Boolean).join('\n');
            document.getElementById('t_about_advantages').value = (a.advantages || []).join('\n');

            document.getElementById('t_projects_heading').value = p.heading || '';
            document.getElementById('t_projects_desc').value = p.desc || '';

            document.getElementById('t_process_heading').value = pr.heading || '';
            document.getElementById('t_process_circle_title').value = pr.circle_title || '';
            document.getElementById('t_process_circle_sub').value = pr.circle_sub || '';
            document.getElementById('t_process_advantages').value = (pr.advantages || []).join('\n');
            var steps = pr.steps || [];
            document.getElementById('t_process_steps').value = steps.map(function(s) {
                return (s.num || '') + '|' + (s.title || '') + '|' + (s.desc || '');
            }).join('\n');
            document.getElementById('t_process_principles_title').value = pr.principles_title || '';
            document.getElementById('t_process_principles_subtitle').value = pr.principles_subtitle || '';
            var principles = pr.principles || [];
            document.getElementById('t_process_principles').value = principles.map(function(p) {
                return (p.heading || '') + '|' + (p.text || '') + '|' + (p.benefit_label || '') + '|' + (p.benefit_text || '');
            }).join('\n');

            document.getElementById('t_contacts_heading').value = c.heading || '';
            document.getElementById('t_contacts_subtitle').value = c.subtitle || '';
            document.getElementById('t_contacts_phone').value = c.phone || '';
            document.getElementById('t_contacts_email').value = c.email || '';
            document.getElementById('t_contacts_schedule').value = c.schedule || '';

            document.getElementById('t_footer_logo_title').value = f.logo_title || '';
            document.getElementById('t_footer_logo_subtitle').value = f.logo_subtitle || '';
            document.getElementById('t_footer_about').value = f.about || '';
            document.getElementById('t_footer_nav_title').value = f.nav_title || '';
            document.getElementById('t_footer_services_title').value = f.services_title || '';
            document.getElementById('t_footer_services').value = (f.services || []).join('\n');
            document.getElementById('t_footer_copy').value = f.copy || '';

            textsModal.classList.add('active');
        }).catch(function(err) {
            alert('Ошибка загрузки: ' + err.message);
        });
    }

    function closeTextsModal() {
        textsModal.classList.remove('active');
    }

    function parseSteps(text) {
        var lines = text.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
        return lines.map(function(line) {
            var parts = line.split('|').map(function(s) { return s.trim(); });
            return { num: parts[0] || '', title: parts[1] || '', desc: parts[2] || '' };
        });
    }

    function parsePrinciples(text) {
        var lines = text.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
        return lines.map(function(line) {
            var parts = line.split('|').map(function(s) { return s.trim(); });
            return {
                heading: parts[0] || '',
                text: parts[1] || '',
                benefit_label: parts[2] || '',
                benefit_text: parts[3] || ''
            };
        });
    }

    textsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var stepsText = document.getElementById('t_process_steps').value;
        var principlesText = document.getElementById('t_process_principles').value;

        // Получаем текущий контент, чтобы сохранить slider_images
        api('/site-content').then(function(currentContent) {
            var payload = {
                hero: {
                    title: document.getElementById('t_hero_title').value.trim(),
                    desc: document.getElementById('t_hero_desc').value.trim(),
                    btn_primary: document.getElementById('t_hero_btn_primary').value.trim(),
                    btn_secondary: document.getElementById('t_hero_btn_secondary').value.trim()
                },
                about: {
                    heading: document.getElementById('t_about_heading').value.trim(),
                    p1: document.getElementById('t_about_p1').value.trim(),
                    p2: document.getElementById('t_about_p2').value.trim(),
                    advantages: document.getElementById('t_about_advantages').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
                    partners_title: document.getElementById('t_about_partners_title').value.trim(),
                    partners: (function() {
                        var lines = document.getElementById('t_about_partners').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
                        return lines.map(function(line) {
                            if (/^img:\s+/i.test(line)) {
                                return { type: 'image', src: line.replace(/^img:\s+/i, '').trim(), alt: 'Партнёр' };
                            }
                            return { type: 'text', name: line };
                        });
                    })()
                },
                projects: {
                    heading: document.getElementById('t_projects_heading').value.trim(),
                    desc: document.getElementById('t_projects_desc').value.trim()
                },
                process: {
                    heading: document.getElementById('t_process_heading').value.trim(),
                    circle_title: document.getElementById('t_process_circle_title').value.trim(),
                    circle_sub: document.getElementById('t_process_circle_sub').value.trim(),
                    advantages: document.getElementById('t_process_advantages').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
                    steps: parseSteps(stepsText),
                    principles_title: document.getElementById('t_process_principles_title').value.trim(),
                    principles_subtitle: document.getElementById('t_process_principles_subtitle').value.trim(),
                    principles: parsePrinciples(principlesText),
                    slider_images: (currentContent.process && currentContent.process.slider_images) || ['images/process.jpg']
                },
                contacts: {
                    heading: document.getElementById('t_contacts_heading').value.trim(),
                    subtitle: document.getElementById('t_contacts_subtitle').value.trim(),
                    phone: document.getElementById('t_contacts_phone').value.trim(),
                    email: document.getElementById('t_contacts_email').value.trim(),
                    schedule: document.getElementById('t_contacts_schedule').value.trim()
                },
                footer: {
                    logo_title: document.getElementById('t_footer_logo_title').value.trim(),
                    logo_subtitle: document.getElementById('t_footer_logo_subtitle').value.trim(),
                    about: document.getElementById('t_footer_about').value.trim(),
                    nav_title: document.getElementById('t_footer_nav_title').value.trim(),
                    services_title: document.getElementById('t_footer_services_title').value.trim(),
                    services: document.getElementById('t_footer_services').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean),
                    copy: document.getElementById('t_footer_copy').value.trim()
                }
            };

            api('/site-content', { method: 'PUT', body: payload }).then(function() {
                closeTextsModal();
                alert('Тексты сохранены. Обновите главную страницу, чтобы увидеть изменения.');
            }).catch(function(err) {
                alert('Ошибка: ' + err.message);
            });
        });
    });

    if (btnEditTexts) btnEditTexts.addEventListener('click', openTextsModal);
    if (textsModalClose) textsModalClose.addEventListener('click', closeTextsModal);
    if (textsModalCancel) textsModalCancel.addEventListener('click', closeTextsModal);
    textsModal.addEventListener('click', function(e) {
        if (e.target === textsModal) closeTextsModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (textsModal && textsModal.classList.contains('active')) closeTextsModal();
            else if (sliderModal && sliderModal.classList.contains('active')) closeSliderModal();
            else closeModal();
        }
    });

    // --- Управление фотографиями слайдера ---
    var sliderModal = document.getElementById('sliderModal');
    var btnManageSlider = document.getElementById('btnManageSlider');
    var sliderModalClose = document.getElementById('sliderModalClose');
    var sliderModalCancel = document.getElementById('sliderModalCancel');
    var sliderImagesList = document.getElementById('sliderImagesList');
    var sliderImagesUpload = document.getElementById('sliderImagesUpload');
    var btnUploadSliderImages = document.getElementById('btnUploadSliderImages');
    var btnSaveSlider = document.getElementById('btnSaveSlider');
    var stepsCount = document.getElementById('stepsCount');

    var currentSliderImages = [];
    var currentSiteContent = null;

    function openSliderModal() {
        api('/site-content').then(function(content) {
            currentSiteContent = content;
            var process = content.process || {};
            currentSliderImages = process.slider_images || ['images/process.jpg'];
            var steps = process.steps || [];
            
            if (stepsCount) stepsCount.textContent = steps.length;
            
            renderSliderImages();
            sliderModal.classList.add('active');
        }).catch(function(err) {
            alert('Ошибка загрузки: ' + err.message);
        });
    }

    function closeSliderModal() {
        sliderModal.classList.remove('active');
    }

    function renderSliderImages() {
        if (!currentSliderImages || currentSliderImages.length === 0) {
            sliderImagesList.innerHTML = '<div class="admin-empty">Изображений пока нет. Загрузите фото.</div>';
            return;
        }

        sliderImagesList.innerHTML = currentSliderImages.map(function(img, index) {
            return (
                '<div class="admin-slider-image-item" data-index="' + index + '">' +
                '<img src="/static/' + img + '" alt="Слайд ' + (index + 1) + '">' +
                '<div class="admin-slider-image-controls">' +
                '<span class="admin-slider-image-num">Этап ' + (index + 1) + '</span>' +
                '<button type="button" class="admin-btn admin-btn-small admin-btn-danger btn-remove-slide" data-index="' + index + '">×</button>' +
                '</div>' +
                '</div>'
            );
        }).join('');

        sliderImagesList.querySelectorAll('.btn-remove-slide').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.getAttribute('data-index'), 10);
                if (confirm('Удалить это изображение из слайдера?')) {
                    currentSliderImages.splice(idx, 1);
                    renderSliderImages();
                }
            });
        });
    }

    function onSliderImagesSelected() {
        var files = sliderImagesUpload && sliderImagesUpload.files;
        if (!files || files.length === 0) return;
        
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) formData.append('files', files[i]);
        formData.append('type', 'slider');
        
        if (btnUploadSliderImages) {
            btnUploadSliderImages.disabled = true;
            btnUploadSliderImages.textContent = 'Загрузка…';
        }
        
        fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        }).then(function(r) {
            if (!r.ok) return r.json().then(function(d) { throw new Error(d.error || 'Ошибка загрузки'); });
            return r.json();
        }).then(function(data) {
            var urls = (data.urls || []).filter(Boolean);
            if (urls.length) {
                // Добавляем новые URL к текущим изображениям
                // Преобразуем полные URL в относительные пути для слайдера
                urls.forEach(function(url) {
                    // Извлекаем путь из полного URL: http://domain/static/images/file.jpg -> images/file.jpg
                    var path = url;
                    if (url.indexOf('/static/') !== -1) {
                        path = url.substring(url.indexOf('/static/') + 8); // +8 для пропуска "/static/"
                    }
                    currentSliderImages.push(path);
                });
                renderSliderImages();
            }
        }).catch(function(err) {
            alert('Ошибка загрузки: ' + err.message);
        }).then(function() {
            if (btnUploadSliderImages) {
                btnUploadSliderImages.disabled = false;
                btnUploadSliderImages.textContent = 'Загрузить фото';
            }
            sliderImagesUpload.value = '';
        });
    }

    function saveSliderImages() {
        if (!currentSiteContent) return;
        
        // Обновляем slider_images в объекте process
        currentSiteContent.process = currentSiteContent.process || {};
        currentSiteContent.process.slider_images = currentSliderImages;
        
        api('/site-content', { method: 'PUT', body: currentSiteContent }).then(function() {
            closeSliderModal();
            alert('Изображения слайдера сохранены. Обновите главную страницу, чтобы увидеть изменения.');
        }).catch(function(err) {
            alert('Ошибка сохранения: ' + err.message);
        });
    }

    if (btnManageSlider) btnManageSlider.addEventListener('click', openSliderModal);
    if (sliderModalClose) sliderModalClose.addEventListener('click', closeSliderModal);
    if (sliderModalCancel) sliderModalCancel.addEventListener('click', closeSliderModal);
    if (btnUploadSliderImages) btnUploadSliderImages.addEventListener('click', function() {
        if (sliderImagesUpload) sliderImagesUpload.click();
    });
    if (sliderImagesUpload) sliderImagesUpload.addEventListener('change', onSliderImagesSelected);
    if (btnSaveSlider) btnSaveSlider.addEventListener('click', saveSliderImages);
    
    sliderModal.addEventListener('click', function(e) {
        if (e.target === sliderModal) closeSliderModal();
    });
})();
