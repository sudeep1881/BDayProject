# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["BDProject/BDProject.csproj", "BDProject/"]
RUN dotnet restore "./BDProject/BDProject.csproj"

COPY . .
WORKDIR "/src/BDProject"

RUN dotnet publish "./BDProject.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    /p:UseAppHost=false


# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "BDProject.dll"]