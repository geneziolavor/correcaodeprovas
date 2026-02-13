export const saveToStorage = (key: string, data: any) => {
    try {
        const fullKey = `inovatec_${key}`;
        const jsonData = JSON.stringify(data);
        console.log(`[STORAGE] Salvando ${fullKey}:`, { data, jsonData: jsonData.substring(0, 100) });
        localStorage.setItem(fullKey, jsonData);
        console.log(`[STORAGE] ${fullKey} salvo com sucesso`);
    } catch (error) {
        console.error('[STORAGE] Erro ao salvar no storage:', error);
    }
};

export const getFromStorage = (key: string, defaultValue: any) => {
    try {
        const fullKey = `inovatec_${key}`;
        const item = localStorage.getItem(fullKey);
        console.log(`[STORAGE] Lendo ${fullKey}:`, { item: item?.substring(0, 100) });
        const parsed = item ? JSON.parse(item) : defaultValue;
        console.log(`[STORAGE] ${fullKey} retornado:`, parsed);
        return parsed;
    } catch (error) {
        console.error('[STORAGE] Erro ao ler do storage:', error);
        return defaultValue;
    }
};
