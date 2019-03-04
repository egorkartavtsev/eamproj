import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
var platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
// для перезагузки приложения при изменениях в исходном коде
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function () {
        // Перед перезапуском приложения создаем новый элемент app, которым заменяем старый
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        platform.destroy();
    });
}
//# sourceMappingURL=main.js.map