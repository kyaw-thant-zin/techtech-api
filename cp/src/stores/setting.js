import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API } from '@/api/index.js'
import { APP } from '@/config.js'

export const useSettingStore = defineStore('setting', () => {

    const _loading = ref(false)
    const _success = ref(false)
    const _error = ref(false)
    const _settings = ref(null)
    const _seos = ref(null)
    const _siteSize = ref(null)
    const _cacheSize = ref(null)
    const _itemPerPage = ref(1)
    const _activeLink = ref('')

    const _head = ref({})

    const storeLoading = (loading) => {
        _loading.value = loading
    }

    const storeError = (error) => {
        _error.value = error
    }

    const storeSuccess = (success) => {
        _success.value = success
    }

    const storeHead = (head) => {
        if(head != null) {
            const dumpHead = head
            const url = APP.ACTIVE_PUBLIC_SITE_URL+'/'
            dumpHead.setting.site_logo = url+dumpHead.setting.site_logo
            dumpHead.setting.icon = url+dumpHead.setting.icon
            dumpHead.seo.og_image = url+dumpHead.seo.og_image
            _head.value = dumpHead
        }
    }

    const storeSettings = (setting) => {
        const settings = {
            'site_name': setting.site_name,
            'description': setting.description,
            'keywords': setting.keywords,
            'site_logo': null,
            'site_logo_local_src': setting.site_logo != null ? APP.ACTIVE_PUBLIC_SITE_URL+'/'+setting.site_logo:null,
            'icon': null,
            'icon_local_src': setting.icon != null ? APP.ACTIVE_PUBLIC_SITE_URL+'/'+setting.icon:null,
            'email': setting.email,
            'footer_text': setting.footer_text,
            'itemPerPage': setting.item_per_page
        }
        _itemPerPage.value = setting.item_per_page
        _siteSize.value = setting.site_size
        _cacheSize.value = setting.cache_size
        _settings.value = settings
    }

    const storeSeos = (seo) => {
        const seos = {
            'type': seo.og_type != null ? seo.og_type.charAt(0).toUpperCase() + seo.og_type.slice(1):null,
            'locale': seo.og_locale,
            'title': seo.og_title,
            'description': seo.og_description,
            'url': seo.og_url,
            'image': null,
            'image_local_src': seo.og_image != null ? APP.ACTIVE_PUBLIC_SITE_URL+'/'+seo.og_image:null,
            'image_width': seo.og_image_width,
            'image_height': seo.og_image_height
        }
        _seos.value = seos
    }

    const handleGetSettings = async () => {
        storeLoading(true)
        const response = await API.setting.getAll()
        storeHead(response)
        storeSettings(response.setting)
        storeSeos(response.seo)
        storeLoading(false)
    }

    const handleUpdateSettings = async (id, formData) => {
        storeLoading(true)
        const response = await API.setting.update(id, formData)
        if(response) {
            storeSuccess(true)
        } else {
            storeError(true)
        }
        storeLoading(false)
    }

    const handleClearCache = async () => {
        storeLoading(true)
        const response = await API.setting.clearCache()
        storeLoading(false)
        return 1
    }

    return {
        _activeLink,
        _head,
        _siteSize,
        _cacheSize,
        _itemPerPage,
        _seos,
        _settings,
        _success,
        _error,
        _loading,
        storeError,
        storeSuccess,
        handleGetSettings,
        handleUpdateSettings,
        handleClearCache
    }

})

