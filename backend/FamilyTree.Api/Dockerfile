FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN ls -R
RUN ls FamilyTree.Api

RUN dotnet restore FamilyTree.Api/FamilyTree.Api.csproj -v diag

# Publish
RUN dotnet publish FamilyTree.Api/FamilyTree.Api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "FamilyTree.Api.dll"]

