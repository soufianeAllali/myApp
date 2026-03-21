<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{

    public function index()
    {
        return Room::with('classes')->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'type' => 'required|string|max:255',
            'classes' => 'array'
        ]);

        $room = Room::create([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'type' => $request->type
        ]);

        $room->classes()->sync($request->classes);

        return response()->json($room->load('classes'),201);
    }


    public function show(Room $room)
    {
        return $room->load('classes');
    }


    public function update(Request $request, Room $room)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer',
            'type' => 'required|string|max:255',
            'classes' => 'array'
        ]);

        $room->update([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'type' => $request->type
        ]);

        $room->classes()->sync($request->classes);

        return response()->json($room->load('classes'));
    }


    public function destroy(Room $room)
    {
        $room->classes()->detach();
        $room->delete();

        return response()->json([
            'message' => 'Room deleted'
        ]);
    }
}