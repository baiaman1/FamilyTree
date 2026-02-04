# ---------- build ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/src/*.sln .
COPY backend/src/FamilyTree.Domain/*.csproj FamilyTree.Domain/
COPY backend/src/FamilyTree.Application/*.csproj FamilyTree.Application/
COPY backend/src/FamilyTree.Infrastructure/*.csproj FamilyTree.Infrastructure/
COPY backend/src/FamilyTree.WebApi/*.csproj FamilyTree.WebApi/

RUN dotnet restore

COPY backend/src .
WORKDIR /src/FamilyTree.WebApi
RUN dotnet publish -c Release -o /app/publish

# ---------- runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "FamilyTree.WebApi.dll"]