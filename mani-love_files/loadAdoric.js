(function(){
    var adoricInterface;

    var BIDomain = window.location.host.indexOf('wixpress') != -1 ? 'http://frog.wixpress.com/' : 'http://frog.wix.com/';
    window.Adoric = window.Adoric || (function () {
        var pagesMap = {
            adorictest: {
                url: 'editor.wix.com'
            },
            LPTest: {
                url: 'www.wix.com/arikwa/copy-of-stunning_sam'
            },
            packagePickerAnon: {
                url : 'www.wix.com/upgrade/website'
            },
            templatesPage: {
                url : 'www.wix.com/website/templates'
            },
            templatesPageGlida: {
                url : 'www.glida.wixpress.com/website/templates'
            },
            templatesPagePizza: {
                url : 'www.pizza.wixpress.com/website/templates/'
            },
            templatesViewer: {
                url : 'www.wix.com/website-template/view'
            },
            templatesPageES: {
                url : 'es.wix.com/website/templates'
            },
            templatesPagePT: {
                url : 'pt.wix.com/website/templates'
            },
            templatesPageRU: {
                url : 'ru.wix.com/website/templates'
            },
            templatesPageFR: {
                url : 'fr.wix.com/website/templates'
            },
            templatesPageJA: {
                url : 'ja.wix.com/website/templates'
            },
            templatesPageDE: {
                url : 'de.wix.com/website/templates'
            },
            templatesPageTR: {
                url : 'tr.wix.com/website/templates'
            },
            templatesPageIT: {
                url : 'it.wix.com/website/templates'
            },
            templatesPageNL: {
                url : 'nl.wix.com/website/templates'
            },
            templatesPageKO: {
                url : 'ko.wix.com/website/templates'
            },
            templatesPagePL: {
                url : 'pl.wix.com/website/templates'
            },
            templatesPageDA: {
                url : 'da.wix.com/website/templates'
            },
            templatesPageSV: {
                url : 'sv.wix.com/website/templates'
            },
            templatesPageNO: {
                url : 'no.wix.com/website/templates'
            },
            LP1: {
                url : 'wix.com/eteamhtml/templates-us'
            },
            LP2: {
                url : 'wix.com/startyoursite/900_a-d-f-g'
            },
            LP3: {
                url : 'wix.com/eteamhtml/900_create'
            },
            LP4: {
                url : 'wix.com/startyoursite/500sca'
            },
            LP5: {
                url : 'wix.com/lpviral/stun-vrl-lil-seo'
            },
            LP6: {
                url : 'wix.com/mystunningwebsites/stun-lil-seo'
            },
            LP7: {
                url : 'wix.com/getyoursite/500kw'
            },
            LP8: {
                url : 'wix.com/tlvmedia/900_create'
            },
            LP9: {
                url : 'wix.com/startyoursite/500kw'
            },
            LP10: {
                url : 'wix.com/buildyourwebsite5/stunning_sam_no'
            },
            LP11: {
                url : 'wix.com/getasite/click-here'
            },
            LP12: {
                url : 'wix.com/htmlsites/-click-here'
            },
            LP13: {
                url : 'wix.com/htmlsites/9-beautiful-site'
            }
        };
        var biMap = {
            close: {
                0: {type: 'closed by click link redirect', evid: 666},
                1: {type: 'closed [by submit form]', evid: 666},
                2: {type: 'closed [by autoclose timer]', evid: 37},
                4: {type: 'closed by user', evid: 36}
            },
            show: {
                0: {type: 'show default', evid: 35},
                1: {type: 'show [by timer]', evid: 35},
                4: {type: 'show by mouseout', evid: 35}
            },
            click: {
                0: {type: 'template click', evid: 38},
                1: {type: 'form click', evid: 666}
            },
            versionSelected: {
                0: {type: 'version selected', evid: 40}
            }
        };
        var FAKE_GUID = 'A1111111-11AA-11AA-A111-1AA11AAA1111';

        function isHomePage() {
            return window.location.href === 'http://www.wix.com/';
        }

        function isTemplateViewer() {
            return window.location.href.indexOf('/view/') > -1;
        }

        function isDashboard() {
            var LAST_INDEX = 36,
                MIN_LENGTH = 37,
                url = window.location.href,
                isMyAccount = url.substr(0, LAST_INDEX + 1);

            return isMyAccount === 'https://www.wix.com/my-account/sites/' && url.lastIndexOf('/') === LAST_INDEX && url.length > MIN_LENGTH;
        }

        function shouldCallAdoric(petriResponse) {
            /* petriResponse = {
             "adoric2": "hidden",
             "templatesViewer": "hidden",
             "templatesPagePT": "hidden",
             "templatesPage": "visible",
             "templatesPageGlida": "visible",
             "templatesPageES": "visible",
             "adorictest": "visible",
             "templatesPagePizza": "visible"
             }*/

            return _.contains(_.keys(petriResponse), findPageNameFromUrl());
        }

        function findPageNameFromUrl() {
            if (isDashboard()) {
                return 'MA_Dashboard';
            } else if (isHomePage()) {
                return 'homePage';
            } else {
                var pageName = '';
                _.forOwn(_.keys(pagesMap), function(index) {
                    if((window.location.href).indexOf(pagesMap[index].url) > -1) {
                        pageName =  index;
                    }
                });
                return pageName;
            }
        }

        function extractPetriValue(petriResponse) {
            return _.first(_.values(_.pick(petriResponse, findPageNameFromUrl())));
        }

        function getPetriExperiments() {
            var xmlhttp = new XMLHttpRequest();
            if (typeof(_) !== 'function') {
                window.Adoric.addLodash();
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    setTimeout(function(){
                        window.Adoric.petriValue = extractPetriValue(JSON.parse(xmlhttp.responseText));
                        if(shouldCallAdoric(JSON.parse(xmlhttp.responseText))) {
                            window.adoricLabelCalledByPage();
                            window.Adoric.callAdoric();
                        }
                    }, 3000); // transfer to requirejs
                }
                // 404 - Not found; 408 - Request Timeout; 500 - Internal Server Error
                if (xmlhttp.status == 404 || xmlhttp.status == 408 || xmlhttp.status == 500) {
                    new Image(0, 0).src = BIDomain + '/trg?src=2&evid=10&cat=1&sev=30&iss=1&errc=11111&ver=1&did=' + FAKE_GUID + '&errn=Error_Getting_VIsibility_From_Petri&dsc=Error getting visibility experiment from petri ' + xmlhttp.status;
                }
            };

            xmlhttp.open('GET', '/_api/wix-laboratory-server/laboratory/conductAllInScope?scope=adoric-all', true);
            xmlhttp.send();
        }

        function callAdoric() {
            var adoric = document.createElement('script');
            adoric.src = 'https://adoric.com/adoric.js?key=7d2e5d7f21df290e88ffd343d418dc25';
            adoric.setAttribute('type', 'text/javascript');
            adoric.setAttribute('class', '__ADORIC__');
            adoric.setAttribute('id', '__ADORIC__SCRIPT__');
            adoric.setAttribute('async', 'true');

            adoric.onload = function () {
                window.AdoricReady();
            };
            adoric.onerror = function () {
                new Image(0, 0).src = BIDomain + 'adoric?src=2&evid=42&is_visible=' + (window.Adoric.petriValue === 'visible');
            };
            document.body.appendChild(adoric);
        }

        function getAndSendUserProfile() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var biReposnse = JSON.parse(xmlhttp.responseText);
                    var userData = biReposnse.payload && biReposnse.payload.fields;
                    var params = {};
                    if (userData) {
                        for (var i = 0; i < userData.length; i++) {
                            var user = userData[i];
                            var sendToAdoric = '';
                            var paramBoolean = 'no';
                            switch (user.name) {
                                case 'first_publish':
                                    params.publishedSite = !!user.value;
                                    break;
                                case 'first_premium_site_id':
                                    params.premium = !!user.value;
                                    break;
                                case 'first_saved_site_date':
                                    params.savedSite = !!user.value;

                                    break;
                                case 'first_dashboard_visit_date':
                                    params.secondTimeOnMA = !!user.value;
                                    break;
                            }
                        }
                    }
                    var info = document.cookie.split('; ');
                    var cookieData = {};
                    info.forEach(function (index) {
                        var arr = index.split('=');
                        if (arr[0] === '_wixUIDX') {
                            cookieData[arr[0]] = arr[1];
                        }
                    });

                    // registered === false when cookieData['_wixUIDX'] is null, or when cookieData['_wixUIDX'] === 'null-user-id'
                    if (!cookieData['_wixUIDX']) {
                        params.registered = false;
                    } else {
                        params.registered = !(cookieData['_wixUIDX'] === 'null-user-id');
                    }

                    // if registered === false send all other params as false to Adoric
                    if (!params.registered) {
                        params.publishedSite = false;
                        params.premium = false;
                        params.savedSite = false;
                    }

                    adoricInterface.trigger(this, 'userProfile', params);
                }
            };
            xmlhttp.open('GET', '/_api/wix-bi-profile-server/userprofile?fields=first_publish,first_premium_site_id,first_saved_site_date,first_dashboard_visit_date&accept=json', true);
            xmlhttp.send();
        }

        function getAdoricLabelCounter() {
            var counter = 0;
            if (localStorage.getItem('adoricLabelCalledByPageCounter')) {
                counter = parseInt((localStorage.getItem('adoricLabelCalledByPageCounter'))) + 1;
            }
            localStorage.setItem('adoricLabelCalledByPageCounter', counter);
            return localStorage.getItem('adoricLabelCalledByPageCounter');
        }

        function addLodash() {
            // transfer to requirejs
            var lodash = document.createElement('script');
            lodash.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js';
            lodash.onload = function () {
                //console.log('lodash loaded');
            };
            document.body.appendChild(lodash);
        }


        return {
            getPetriExperiments: getPetriExperiments,
            callAdoric: callAdoric,
            addLodash: addLodash,
            findPageNameFromUrl: findPageNameFromUrl,
            getAdoricLabelCounter: getAdoricLabelCounter,
            getAndSendUserProfile: getAndSendUserProfile,
            isTemplateViewer: isTemplateViewer,
            biMap: biMap,
            pagesMap: pagesMap
        }
    })();

    window.adoricLabelCalledByPage = function () {
        var isVisible = window.Adoric.petriValue === 'visible';
        var pageName = window.Adoric.findPageNameFromUrl();
        var adoricCounter = window.Adoric.getAdoricLabelCounter();

        new Image(0, 0).src = BIDomain + 'adoric?src=2&evid=4&is_visible=' + isVisible + '&event_counter=' + adoricCounter + '&page_name=' + pageName;
    };

    window.AdoricReady = function () {
        adoricInterface = window.adoric;
        adoricInterface.trigger(this, 'setConfig', {'isVisible': window.Adoric.petriValue === 'visible'});

        if (window.Adoric.isTemplateViewer()) {
            window.templateEditUrl ? adoricInterface.trigger(this, 'setDynamicLink', {'ident_url_any_text': window.templateEditUrl}): console.log('missing templateEditUrl');
        }

        function makeCallback(eventId) {
            return function (data) {
                var id;
                var reasonKey = data.reason || 0;
                switch (eventId) {
                    case 'lightbox:before:show':
                        id = 'show';
                        break;
                    case 'lightbox:before:close':
                        id = 'close';
                        break;
                    case 'lightbox:before:click':
                        id = 'click';
                        break;
                    case 'version:selected':
                        id = 'versionSelected';
                        break;
                }
                if (window.Adoric.biMap[id][reasonKey].evid === 666) {
                    return
                }
                var params = 'evid=' + window.Adoric.biMap[id][reasonKey].evid + '&lb_id=' + data.lightbox.id + '&adoric_uuid=' + data.userId;
                if (window.Adoric.biMap[id][reasonKey].evid === 38) {
                    params += '&value=' + data.track + '&action=click&type=link';
                }
                if (window.Adoric.biMap[id][reasonKey].evid === 35 || window.Adoric.biMap[id][reasonKey].evid === 40) {
                    params += '&is_visible=' + data.isVisible;
                }

                new Image(0, 0).src = BIDomain + 'adoric?src=2&' + params + '&_=' + new Date().getTime();
            }
        }

        window.Adoric.getAndSendUserProfile();
        if (adoricInterface) {
            adoricInterface.on('version:selected', makeCallback('version:selected'));
            adoricInterface.on('lightbox:before:show', makeCallback('lightbox:before:show'));
            adoricInterface.on('lightbox:before:click', makeCallback('lightbox:before:click'));
            adoricInterface.on('lightbox:before:close', makeCallback('lightbox:before:close'));
        }
    }
})();

