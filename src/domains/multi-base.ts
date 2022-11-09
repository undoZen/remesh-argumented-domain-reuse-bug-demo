import { Remesh } from "remesh"
import { AsyncModule } from "remesh/modules/async";
import { of } from "rxjs";

const dict = {
    'en': 'world',
    'zh': '世界',
}
export type Lang = keyof typeof dict
const BaseDomain = Remesh.domain({
    name: 'BaseDomain',
    // impl: (domain) => {
    impl: (domain, lang: Lang) => {
        // lang = 'en'
        
        const NameAsyncModule = AsyncModule(domain, {
            name: 'NameAsyncModule',
            load: async ({ get }, noarg: void) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return {
                    name: dict[lang]
                }
            }
        });
        domain.effect({
            name: 'LoadNameEffect',
            impl: ({ get, fromQuery, fromEvent }) => {
                return of([NameAsyncModule.command.LoadCommand()])
            },
        });

        const LoadedNameQuery = domain.query({
            name: 'LoadedNameQuery',
            impl: ({ get }) => {
                const asyncData = get(NameAsyncModule.query.AsyncDataQuery());
                if (asyncData.type !== 'success') {
                    return 'unknown'
                }
                return asyncData.value.name;
            },
        });

        return {
            query: {
                NameAsyncDataQuery: NameAsyncModule.query.AsyncDataQuery,
                LoadedNameQuery,
            },
            event: {
                LoadedEvent: NameAsyncModule.event.SuccessEvent,
            }
        }
    },
});
export { BaseDomain };