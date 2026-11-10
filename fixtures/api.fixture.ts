import { test as dataTest } from './data.fixture';
import { ConduitApi } from '../api/conduit-api';

type ApiFixtures = { conduitApi: ConduitApi };

export const test = dataTest.extend<ApiFixtures>({
    conduitApi: async ({ adminUser, baseURL }, use) => {
        const conduitApi = await ConduitApi.Login(adminUser.email, adminUser.password, baseURL);
        await use(conduitApi);
        await conduitApi.request.dispose();
    },
}); 