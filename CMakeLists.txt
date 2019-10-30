cmake_minimum_required(VERSION 3.9.2)
project(simplex)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -std=c11")
set(CMAKE_CXX_STANDARD 11)

include_directories(
        ./include
        ./lib/C-Macro-Collections/src
)

file(GLOB SOURCE
        "./src/*.c"
)

add_executable(main ${SOURCE})
