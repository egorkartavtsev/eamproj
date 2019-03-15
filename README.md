# eamproj
Приложение разрабатывается на связке Angular7 + .net Core 2.0
Для подключения к базе используется ODP.NET Core

* Разработка и сборка проекта проводится в VisualStudio 2017.
* Для успешного запуска проекта необходимо установить NodeJS и NPM.

* Если приложение настраивается впервые на машине, то предварительно нужно развернуть и настроить пустое приложение.
	- Инструктция: https://metanit.com/sharp/aspnetcore/1.1.php

* Обязательно требуется  установить ODP.NET Core при помощи диспетчера пакетов NuGet.
	- Шаг 2 в инструкции: https://www.oracle.com/webfolder/technetwork/tutorials/obe/db/dotnet/ODPNET_Core_get_started/index.html
	- ! без него не будет осуществляться подключение к базе данных !
	
	-------------------------------------------------------------------------------------------
* Версия разработчика смотрит на DEV.
* Перед публикацияей ОБЯЗАТЕЛЬНО менять сервер на PSI. Для этого необходимо в файле dbHandler.cs изменить сервер.
* После публикации серввер следует менять обратно на DEV.

	-------------------------------------------------------------------------------------------
* !!! Заливать на гит с сервером DEV !!!
