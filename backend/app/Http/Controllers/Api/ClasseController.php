<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        return SchoolClass::with('subjects')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'subjects' => 'required|array|min:1',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.hours_per_week' => 'required|integer|min:1'
        ]);

        $classe = SchoolClass::create([
            'name' => $request->name,
            'level' => $request->level
        ]);
    
        $syncData = [];
        foreach ($request->subjects as $subject) {
            $syncData[$subject['subject_id']] = [
                'hours_per_week' => $subject['hours_per_week']
            ];
        }

        $classe->subjects()->sync($syncData);

        return response()->json($classe->load('subjects'), 201);
    }

    public function show(SchoolClass $classe)
    {
        return $classe->load('subjects');
    }

    public function update(Request $request, $id)
    {
        $classe = SchoolClass::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'subjects' => 'required|array|min:1',
            'subjects.*.subject_id' => 'required|exists:subjects,id',
            'subjects.*.hours_per_week' => 'required|integer|min:1'
        ]);

        $classe->update([
            'name' => $request->name,
            'level' => $request->level
        ]);

        $syncData = [];

        foreach ($request->subjects as $subject) {
            $syncData[$subject['subject_id']] = [
                'hours_per_week' => $subject['hours_per_week']
            ];
        }

        $classe->subjects()->sync($syncData);

        return response()->json($classe->load('subjects'));
    }

    public function destroy($id)
    {
        $classe = SchoolClass::findOrFail($id);

        $classe->subjects()->detach();
        $classe->delete();

        return response()->json([
            'message' => 'Classe deleted successfully'
        ]);
    }
}